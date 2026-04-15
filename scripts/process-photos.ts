/**
 * Photo processing pipeline — Phase 7
 *
 * Reads original photos from /originals/, generates four WebP variants plus a
 * base64 blur placeholder for each, writes them to public/photos/[id]/, and
 * updates public/photos.json with the full manifest.
 *
 * Usage:
 *   npm run photos:process
 *   npm run photos:process -- --local-only   (same behaviour; flag reserved for Phase 8)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PhotoSrcSet {
  thumbnail: string;
  medium: string;
  large: string;
  full: string;
}

interface PhotoManifestEntry {
  id: string;
  title: string;
  category: string;
  width: number;
  height: number;
  src: string;
  alt: string;
  order: number;
  placeholder: string;
  srcset: PhotoSrcSet;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const ORIGINALS_DIR = path.join(REPO_ROOT, 'originals');
const OUTPUT_DIR = path.join(REPO_ROOT, 'public', 'photos');
const MANIFEST_PATH = path.join(REPO_ROOT, 'public', 'photos.json');

const SIZES = {
  thumbnail: 400,
  medium: 800,
  large: 1600,
  full: 2400,
} as const;

const PLACEHOLDER_WIDTH = 20;
export const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.heif', '.heic']);

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Slugify a filename into an id: strip extension, lowercase, replace spaces/underscores with hyphens */
export function filenameToId(filename: string): string {
  return path.basename(filename, path.extname(filename))
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
  const metadata = await sharp(imagePath).metadata();
  const originalWidth = metadata.width ?? 0;

  const pipeline = sharp(imagePath).webp({ quality: 82 });

  // Don't upscale — use original dimensions if smaller than target
  if (originalWidth > targetWidth) {
    pipeline.resize({ width: targetWidth, withoutEnlargement: true });
  }

  const info = await pipeline.toFile(outputPath);
  return { width: info.width, height: info.height };
}

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

  // Base64 placeholder
  const placeholder = await generateBase64Placeholder(originalPath);

  // The "large" variant is the canonical src and dimensions source
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
    category: 'street', // default; user can edit photos.json to set actual category
    width,
    height,
    src: `/photos/${id}/large.webp`,
    alt: title,
    order,
    placeholder,
    srcset,
  };
}

// ─── Manifest helpers ─────────────────────────────────────────────────────────

function loadExistingManifest(): PhotoManifestEntry[] {
  if (!fs.existsSync(MANIFEST_PATH)) return [];
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf-8');
  return JSON.parse(raw) as PhotoManifestEntry[];
}

/**
 * Merge newly processed entries into the existing manifest.
 * Existing entries for the same id are replaced; new entries are appended.
 * Order values from existing entries are preserved unless overridden.
 */
export function mergeManifest(
  existing: PhotoManifestEntry[],
  incoming: PhotoManifestEntry[],
): PhotoManifestEntry[] {
  const map = new Map(existing.map((e) => [e.id, e]));
  for (const entry of incoming) {
    // Preserve manually-set title/category/alt/order from existing manifest
    const prev = map.get(entry.id);
    map.set(entry.id, {
      ...entry,
      title: prev?.title ?? entry.title,
      category: prev?.category ?? entry.category,
      alt: prev?.alt ?? entry.alt,
      order: prev?.order ?? entry.order,
    });
  }
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!fs.existsSync(ORIGINALS_DIR)) {
    console.error(`\nNo originals/ directory found at: ${ORIGINALS_DIR}`);
    console.error('Create an originals/ directory at the repo root and add your photos to it.\n');
    process.exit(1);
  }

  const files = fs
    .readdirSync(ORIGINALS_DIR)
    .filter((f) => SUPPORTED_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort(); // consistent ordering

  if (files.length === 0) {
    console.log('\nNo supported images found in originals/. Nothing to process.\n');
    process.exit(0);
  }

  console.log(`\nFound ${files.length} image(s) in originals/\n`);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const existing = loadExistingManifest();
  const incoming: PhotoManifestEntry[] = [];

  for (let i = 0; i < files.length; i++) {
    const originalPath = path.join(ORIGINALS_DIR, files[i]);
    const entry = await processPhoto(originalPath, existing.length + i + 1);
    incoming.push(entry);
  }

  const merged = mergeManifest(existing, incoming);
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(merged, null, 2) + '\n');

  console.log(`\nDone. Manifest updated: ${MANIFEST_PATH}`);
  console.log(`Total photos in manifest: ${merged.length}\n`);
}

// Only run when executed directly — not when imported by tests
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err: unknown) => {
    console.error('\nProcessing failed:', err);
    process.exit(1);
  });
}
