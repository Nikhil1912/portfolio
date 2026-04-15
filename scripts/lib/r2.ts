import fs from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import type { PhotoSrcSet } from './types.js';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

/**
 * Load R2 config from environment variables.
 * Returns null if any variable is missing — callers use this to decide whether
 * to run in local-only mode.
 */
export function loadR2Config(): R2Config | null {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL } =
    process.env;

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME || !R2_PUBLIC_URL) {
    return null;
  }

  return {
    accountId: R2_ACCOUNT_ID,
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    bucketName: R2_BUCKET_NAME,
    publicUrl: R2_PUBLIC_URL.replace(/\/$/, ''), // strip trailing slash
  };
}

/** Create an S3Client pointed at the Cloudflare R2 endpoint for the given account */
export function createR2Client(config: R2Config): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

/**
 * Upload a single local file to R2.
 *
 * The object key is the path within the bucket (e.g. "photos/morning-mist/large.webp").
 * Returns the public URL of the uploaded object.
 */
export async function uploadFile(
  client: S3Client,
  config: R2Config,
  localPath: string,
  objectKey: string,
): Promise<string> {
  const body = fs.readFileSync(localPath);
  const ext = path.extname(localPath).toLowerCase();
  const contentType = ext === '.webp' ? 'image/webp' : 'application/octet-stream';

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: objectKey,
      Body: body,
      ContentType: contentType,
      // One year cache — content-addressed by filename so safe to cache aggressively
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return `${config.publicUrl}/${objectKey}`;
}

/**
 * Check whether an object already exists in R2.
 * Used to skip re-uploading files that haven't changed.
 */
export async function objectExists(
  client: S3Client,
  bucketName: string,
  objectKey: string,
): Promise<boolean> {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucketName, Key: objectKey }));
    return true;
  } catch {
    return false;
  }
}

/**
 * Upload all four WebP variants for a photo to R2.
 * Skips any size that already exists in the bucket (idempotent re-runs).
 * Returns an srcset object with R2 public URLs.
 */
export async function uploadPhotoVariants(
  client: S3Client,
  config: R2Config,
  photoId: string,
  localPhotoDir: string,
): Promise<{ srcset: PhotoSrcSet; src: string }> {
  const sizes = ['thumbnail', 'medium', 'large', 'full'] as const;
  const srcset = {} as PhotoSrcSet;

  await Promise.all(
    sizes.map(async (size) => {
      const localPath = path.join(localPhotoDir, `${size}.webp`);
      const objectKey = `photos/${photoId}/${size}.webp`;

      const alreadyUploaded = await objectExists(client, config.bucketName, objectKey);
      if (alreadyUploaded) {
        console.log(`    [skip] ${objectKey} already in R2`);
        srcset[size] = `${config.publicUrl}/${objectKey}`;
        return;
      }

      console.log(`    [upload] ${objectKey}`);
      srcset[size] = await uploadFile(client, config, localPath, objectKey);
    }),
  );

  return { srcset, src: srcset['large'] };
}
