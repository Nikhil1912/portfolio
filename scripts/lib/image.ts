import path from 'node:path';
import sharp from 'sharp';

export const PLACEHOLDER_WIDTH = 20;

export const SIZES = {
  thumbnail: 400,
  medium: 800,
  large: 1600,
  full: 2400,
} as const;

export const SUPPORTED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.tiff',
  '.tif',
  '.heif',
  '.heic',
]);

/** Slugify a filename into an id: strip extension, lowercase, replace spaces/underscores with hyphens */
export function filenameToId(filename: string): string {
  return path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/** Title-case the id for use as an auto-generated alt/title */
export function idToTitle(id: string): string {
  return id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Compute the aspect ratio width/height, rounded to 4 decimal places */
export function computeAspectRatio(width: number, height: number): number {
  if (height === 0) throw new Error('Height cannot be zero when computing aspect ratio');
  return Math.round((width / height) * 10000) / 10000;
}

/**
 * Generate a 20px-wide blurred WebP thumbnail and return it as a base64 data URI.
 * The URI is suitable for use as an <img> src while the real image loads.
 */
export async function generateBase64Placeholder(imagePath: string): Promise<string> {
  const buffer = await sharp(imagePath)
    .rotate()
    .resize({ width: PLACEHOLDER_WIDTH })
    .blur(4)
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

/**
 * Resize the image to the given width (preserving aspect ratio) and save as WebP.
 * If the original is narrower than the target width, the original size is kept.
 * Returns the actual output dimensions.
 */
export async function resizeToWebP(
  imagePath: string,
  outputPath: string,
  targetWidth: number,
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(imagePath).rotate().metadata();
  const originalWidth = metadata.width ?? 0;

  const pipeline = sharp(imagePath).rotate().webp({ quality: 82 });

  if (originalWidth > targetWidth) {
    pipeline.resize({ width: targetWidth, withoutEnlargement: true });
  }

  const info = await pipeline.toFile(outputPath);
  return { width: info.width, height: info.height };
}
