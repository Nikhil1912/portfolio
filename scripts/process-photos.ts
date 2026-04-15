/**
 * Photo processing pipeline — Phase 7 / Phase 8
 *
 * Reads original photos from /originals/, generates four WebP variants plus a
 * base64 blur placeholder for each, writes them to public/photos/[id]/, and
 * updates public/photos.json with the full manifest.
 *
 * In Phase 8 mode (R2 env vars present and --local-only not passed), processed
 * images are also uploaded to Cloudflare R2 and photos.json is written with R2
 * public URLs instead of local paths.
 *
 * Usage:
 *   npm run photos:process                # process + upload to R2 (if configured)
 *   npm run photos:process -- --local-only  # process locally only, skip R2 upload
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env.local before anything reads process.env — tsx does not do this
// automatically (it's a Next.js convention, not a Node.js one).
const REPO_ROOT_FOR_ENV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envLocalPath = path.join(REPO_ROOT_FOR_ENV, '.env.local');
if (fs.existsSync(envLocalPath)) {
  for (const line of fs.readFileSync(envLocalPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    // Don't overwrite values already set in the shell environment
    if (!(key in process.env)) process.env[key] = value;
  }
}

import { SIZES, SUPPORTED_EXTENSIONS, filenameToId, idToTitle, generateBase64Placeholder, resizeToWebP } from './lib/image.js';
import { loadExistingManifest, buildManifest } from './lib/manifest.js';
import { loadR2Config, createR2Client, uploadPhotoVariants } from './lib/r2.js';
import type { PhotoManifestEntry, PhotoSrcSet } from './lib/types.js';

// Re-export for tests that import from this file directly
export { filenameToId, idToTitle, computeAspectRatio, generateBase64Placeholder, resizeToWebP, SUPPORTED_EXTENSIONS } from './lib/image.js';
export { buildManifest } from './lib/manifest.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINALS_DIR = path.join(REPO_ROOT, 'originals');
const OUTPUT_DIR = path.join(REPO_ROOT, 'public', 'photos');
const MANIFEST_PATH = path.join(REPO_ROOT, 'public', 'photos.json');

// ─── Core pipeline ────────────────────────────────────────────────────────────

async function processPhoto(
  originalPath: string,
  order: number,
): Promise<PhotoManifestEntry> {
  const filename = path.basename(originalPath);
  const id = filenameToId(filename);
  const title = idToTitle(id);

  const photoOutputDir = path.join(OUTPUT_DIR, id);
  fs.mkdirSync(photoOutputDir, { recursive: true });

  console.log(`  Processing: ${filename} → ${id}`);

  // Generate all four sizes in parallel
  const sizeEntries = Object.entries(SIZES) as Array<[keyof typeof SIZES, number]>;
  const sizeResults = await Promise.all(
    sizeEntries.map(async ([sizeName, width]) => {
      const outputPath = path.join(photoOutputDir, `${sizeName}.webp`);
      const dimensions = await resizeToWebP(originalPath, outputPath, width);
      return { sizeName, outputPath, dimensions };
    }),
  );

  const placeholder = await generateBase64Placeholder(originalPath);

  const largeResult = sizeResults.find((r) => r.sizeName === 'large')!;
  const { width, height } = largeResult.dimensions;

  const srcset: PhotoSrcSet = {
    thumbnail: `/photos/${id}/thumbnail.webp`,
    medium: `/photos/${id}/medium.webp`,
    large: `/photos/${id}/large.webp`,
    full: `/photos/${id}/full.webp`,
  };

  return {
    id,
    title,
    category: 'street',
    width,
    height,
    src: `/photos/${id}/large.webp`,
    alt: title,
    order,
    placeholder,
    srcset,
  };
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const localOnly = process.argv.includes('--local-only');

  if (!fs.existsSync(ORIGINALS_DIR)) {
    console.error(`\nNo originals/ directory found at: ${ORIGINALS_DIR}`);
    console.error('Create an originals/ directory at the repo root and add your photos to it.\n');
    process.exit(1);
  }

  const files = fs
    .readdirSync(ORIGINALS_DIR)
    .filter((f) => SUPPORTED_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.log('\nNo supported images found in originals/. Nothing to process.\n');
    process.exit(0);
  }

  console.log(`\nFound ${files.length} image(s) in originals/\n`);

  // Determine R2 mode
  const r2Config = localOnly ? null : loadR2Config();
  if (!localOnly && r2Config === null) {
    console.log('R2 env vars not set — running in local-only mode (pass --local-only to suppress this message).\n');
  } else if (r2Config !== null) {
    console.log(`R2 mode: uploading to bucket "${r2Config.bucketName}"\n`);
  }

  const r2Client = r2Config ? createR2Client(r2Config) : null;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const existing = loadExistingManifest(MANIFEST_PATH);
  const incoming: PhotoManifestEntry[] = [];

  for (let i = 0; i < files.length; i++) {
    const originalPath = path.join(ORIGINALS_DIR, files[i]);
    const entry = await processPhoto(originalPath, i + 1);

    // If R2 is configured, upload variants and rewrite URLs to R2 public URLs
    if (r2Client && r2Config) {
      const photoOutputDir = path.join(OUTPUT_DIR, entry.id);
      console.log(`  Uploading to R2: ${entry.id}`);
      const { srcset, src } = await uploadPhotoVariants(r2Client, r2Config, entry.id, photoOutputDir);
      entry.srcset = srcset;
      entry.src = src;
    }

    incoming.push(entry);
  }

  const merged = buildManifest(existing, incoming);
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(merged, null, 2) + '\n');

  console.log(`\nDone. Manifest updated: ${MANIFEST_PATH}`);
  console.log(`Total photos in manifest: ${merged.length}`);
  if (r2Config) {
    console.log(`Image URLs: ${r2Config.publicUrl}/photos/[id]/[size].webp`);
  }
  console.log();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err: unknown) => {
    console.error('\nProcessing failed:', err);
    process.exit(1);
  });
}
