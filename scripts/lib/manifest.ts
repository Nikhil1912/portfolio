import fs from 'node:fs';
import type { PhotoManifestEntry } from './types.js';

export function loadExistingManifest(manifestPath: string): PhotoManifestEntry[] {
  if (!fs.existsSync(manifestPath)) return [];
  const raw = fs.readFileSync(manifestPath, 'utf-8');
  return JSON.parse(raw) as PhotoManifestEntry[];
}

/**
 * Build the manifest from freshly-processed entries, preserving any manual
 * edits (title, category, alt, order) from the existing manifest for photos
 * that are still present in originals/.
 *
 * Photos that were removed from originals/ are dropped from the manifest —
 * the manifest is always a faithful reflection of what was actually processed.
 */
export function buildManifest(
  existing: PhotoManifestEntry[],
  incoming: PhotoManifestEntry[],
): PhotoManifestEntry[] {
  const existingById = new Map(existing.map((e) => [e.id, e]));
  return incoming
    .map((entry) => {
      const prev = existingById.get(entry.id);
      return {
        ...entry,
        title: prev?.title ?? entry.title,
        category: prev?.category ?? entry.category,
        alt: prev?.alt ?? entry.alt,
        order: prev?.order ?? entry.order,
      };
    })
    .sort((a, b) => a.order - b.order);
}
