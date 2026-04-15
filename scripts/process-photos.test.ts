import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  filenameToId,
  idToTitle,
  computeAspectRatio,
  generateBase64Placeholder,
  resizeToWebP,
  mergeManifest,
} from './process-photos';

// ─── Mock sharp ───────────────────────────────────────────────────────────────

const mockToBuffer = vi.fn();
const mockToFile = vi.fn();
const mockMetadata = vi.fn();
const mockBlur = vi.fn();
const mockWebp = vi.fn();
const mockResize = vi.fn();

const mockSharpInstance = {
  resize: mockResize,
  blur: mockBlur,
  webp: mockWebp,
  toBuffer: mockToBuffer,
  toFile: mockToFile,
  metadata: mockMetadata,
};

// Each chained method returns the same mock instance
mockResize.mockReturnValue(mockSharpInstance);
mockBlur.mockReturnValue(mockSharpInstance);
mockWebp.mockReturnValue(mockSharpInstance);

vi.mock('sharp', () => ({
  default: vi.fn(() => mockSharpInstance),
}));

// ─── filenameToId ─────────────────────────────────────────────────────────────

describe('filenameToId', () => {
  it('strips extension and lowercases', () => {
    expect(filenameToId('Morning-Mist.jpg')).toBe('morning-mist');
  });

  it('replaces spaces with hyphens', () => {
    expect(filenameToId('golden hour.jpeg')).toBe('golden-hour');
  });

  it('replaces underscores with hyphens', () => {
    expect(filenameToId('still_waters.png')).toBe('still-waters');
  });

  it('removes non-alphanumeric characters (except hyphens)', () => {
    expect(filenameToId('café_street!.jpg')).toBe('caf-street');
  });

  it('handles filenames that are already clean', () => {
    expect(filenameToId('photo-001.webp')).toBe('photo-001');
  });
});

// ─── idToTitle ────────────────────────────────────────────────────────────────

describe('idToTitle', () => {
  it('title-cases each hyphen-separated word', () => {
    expect(idToTitle('morning-mist')).toBe('Morning Mist');
  });

  it('handles single-word ids', () => {
    expect(idToTitle('coastline')).toBe('Coastline');
  });

  it('handles ids with numbers', () => {
    expect(idToTitle('photo-001')).toBe('Photo 001');
  });
});

// ─── computeAspectRatio ───────────────────────────────────────────────────────

describe('computeAspectRatio', () => {
  it('computes landscape ratio correctly', () => {
    expect(computeAspectRatio(1920, 1080)).toBeCloseTo(1.7778, 3);
  });

  it('computes portrait ratio correctly', () => {
    expect(computeAspectRatio(800, 1200)).toBeCloseTo(0.6667, 3);
  });

  it('computes square ratio as 1', () => {
    expect(computeAspectRatio(1000, 1000)).toBe(1);
  });

  it('rounds to 4 decimal places', () => {
    const ratio = computeAspectRatio(1920, 1080);
    const decimals = ratio.toString().split('.')[1]?.length ?? 0;
    expect(decimals).toBeLessThanOrEqual(4);
  });

  it('throws when height is zero', () => {
    expect(() => computeAspectRatio(1920, 0)).toThrow('Height cannot be zero');
  });
});

// ─── generateBase64Placeholder ───────────────────────────────────────────────

describe('generateBase64Placeholder', () => {
  beforeEach(() => {
    mockToBuffer.mockResolvedValue(Buffer.from('fake-webp-data'));
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Re-apply chaining mocks after clearAllMocks
    mockResize.mockReturnValue(mockSharpInstance);
    mockBlur.mockReturnValue(mockSharpInstance);
    mockWebp.mockReturnValue(mockSharpInstance);
  });

  it('returns a data URI with the correct MIME type', async () => {
    const result = await generateBase64Placeholder('/fake/photo.jpg');
    expect(result).toMatch(/^data:image\/webp;base64,/);
  });

  it('returns a valid base64 string after the prefix', async () => {
    const result = await generateBase64Placeholder('/fake/photo.jpg');
    const base64Part = result.replace('data:image/webp;base64,', '');
    expect(base64Part).toBe(Buffer.from('fake-webp-data').toString('base64'));
  });

  it('resizes to 20px width', async () => {
    await generateBase64Placeholder('/fake/photo.jpg');
    expect(mockResize).toHaveBeenCalledWith({ width: 20 });
  });

  it('applies blur', async () => {
    await generateBase64Placeholder('/fake/photo.jpg');
    expect(mockBlur).toHaveBeenCalled();
  });
});

// ─── resizeToWebP ─────────────────────────────────────────────────────────────

describe('resizeToWebP', () => {
  afterEach(() => {
    vi.clearAllMocks();
    mockResize.mockReturnValue(mockSharpInstance);
    mockBlur.mockReturnValue(mockSharpInstance);
    mockWebp.mockReturnValue(mockSharpInstance);
  });

  it('resizes to target width when original is larger', async () => {
    mockMetadata.mockResolvedValue({ width: 4000, height: 3000 });
    mockToFile.mockResolvedValue({ width: 1600, height: 1200 });

    const result = await resizeToWebP('/fake/photo.jpg', '/fake/out/large.webp', 1600);

    expect(mockResize).toHaveBeenCalledWith({ width: 1600, withoutEnlargement: true });
    expect(result).toEqual({ width: 1600, height: 1200 });
  });

  it('does not resize when original is smaller than target', async () => {
    mockMetadata.mockResolvedValue({ width: 800, height: 600 });
    mockToFile.mockResolvedValue({ width: 800, height: 600 });

    await resizeToWebP('/fake/photo.jpg', '/fake/out/large.webp', 1600);

    expect(mockResize).not.toHaveBeenCalled();
  });

  it('outputs WebP format', async () => {
    mockMetadata.mockResolvedValue({ width: 4000, height: 3000 });
    mockToFile.mockResolvedValue({ width: 1600, height: 1200 });

    await resizeToWebP('/fake/photo.jpg', '/fake/out/large.webp', 1600);

    expect(mockWebp).toHaveBeenCalledWith({ quality: 82 });
  });

  it('returns dimensions from the output file info', async () => {
    mockMetadata.mockResolvedValue({ width: 2400, height: 1600 });
    mockToFile.mockResolvedValue({ width: 400, height: 267 });

    const result = await resizeToWebP('/fake/photo.jpg', '/fake/out/thumbnail.webp', 400);
    expect(result).toEqual({ width: 400, height: 267 });
  });
});

// ─── mergeManifest ────────────────────────────────────────────────────────────

describe('mergeManifest', () => {
  const baseEntry = {
    id: 'morning-mist',
    title: 'Morning Mist',
    category: 'landscape',
    width: 1600,
    height: 900,
    src: '/photos/morning-mist/large.webp',
    alt: 'Morning mist over rolling hills',
    order: 1,
    placeholder: 'data:image/webp;base64,abc',
    srcset: {
      thumbnail: '/photos/morning-mist/thumbnail.webp',
      medium: '/photos/morning-mist/medium.webp',
      large: '/photos/morning-mist/large.webp',
      full: '/photos/morning-mist/full.webp',
    },
  };

  it('returns incoming entries when manifest is empty', () => {
    const result = mergeManifest([], [baseEntry]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('morning-mist');
  });

  it('replaces an existing entry with the same id', () => {
    const updated = { ...baseEntry, placeholder: 'data:image/webp;base64,NEW' };
    const result = mergeManifest([baseEntry], [updated]);
    expect(result).toHaveLength(1);
    expect(result[0].placeholder).toBe('data:image/webp;base64,NEW');
  });

  it('preserves manually-set category from existing manifest', () => {
    const incoming = { ...baseEntry, category: 'street' };
    const result = mergeManifest([baseEntry], [incoming]);
    expect(result[0].category).toBe('landscape'); // preserved from existing
  });

  it('preserves manually-set title from existing manifest', () => {
    const incoming = { ...baseEntry, title: 'Auto Generated Title' };
    const result = mergeManifest([baseEntry], [incoming]);
    expect(result[0].title).toBe('Morning Mist'); // preserved from existing
  });

  it('preserves manually-set order from existing manifest', () => {
    const incoming = { ...baseEntry, order: 99 };
    const result = mergeManifest([baseEntry], [incoming]);
    expect(result[0].order).toBe(1); // preserved from existing
  });

  it('appends new entries not in the existing manifest', () => {
    const newEntry = { ...baseEntry, id: 'golden-hour', order: 2 };
    const result = mergeManifest([baseEntry], [newEntry]);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toContain('golden-hour');
  });

  it('sorts the result by order', () => {
    const entry2 = { ...baseEntry, id: 'second', order: 2 };
    const entry3 = { ...baseEntry, id: 'third', order: 3 };
    const result = mergeManifest([entry3, baseEntry], [entry2]);
    expect(result.map((e) => e.order)).toEqual([1, 2, 3]);
  });
});
