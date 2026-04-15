import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadR2Config, createR2Client, uploadFile, objectExists, uploadPhotoVariants } from './r2.js';

// ─── Mock @aws-sdk/client-s3 ─────────────────────────────────────────────────

const mockSend = vi.fn();

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: mockSend })),
  PutObjectCommand: vi.fn().mockImplementation((input) => ({ input })),
  HeadObjectCommand: vi.fn().mockImplementation((input) => ({ input })),
}));

// ─── Mock node:fs ─────────────────────────────────────────────────────────────

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn().mockReturnValue(Buffer.from('fake-image-data')),
    existsSync: vi.fn().mockReturnValue(true),
  },
}));

// ─── loadR2Config ─────────────────────────────────────────────────────────────

describe('loadR2Config', () => {
  const validEnv = {
    R2_ACCOUNT_ID: 'abc123',
    R2_ACCESS_KEY_ID: 'key123',
    R2_SECRET_ACCESS_KEY: 'secret456',
    R2_BUCKET_NAME: 'my-bucket',
    R2_PUBLIC_URL: 'https://pub-xxxx.r2.dev',
  };

  beforeEach(() => {
    for (const [k, v] of Object.entries(validEnv)) process.env[k] = v;
  });

  afterEach(() => {
    for (const k of Object.keys(validEnv)) delete process.env[k];
  });

  it('returns config when all env vars are set', () => {
    const config = loadR2Config();
    expect(config).not.toBeNull();
    expect(config?.accountId).toBe('abc123');
    expect(config?.bucketName).toBe('my-bucket');
  });

  it('strips trailing slash from publicUrl', () => {
    process.env.R2_PUBLIC_URL = 'https://pub-xxxx.r2.dev/';
    const config = loadR2Config();
    expect(config?.publicUrl).toBe('https://pub-xxxx.r2.dev');
  });

  it('returns null when any env var is missing', () => {
    delete process.env.R2_SECRET_ACCESS_KEY;
    expect(loadR2Config()).toBeNull();
  });

  it('returns null when all env vars are missing', () => {
    for (const k of Object.keys(validEnv)) delete process.env[k];
    expect(loadR2Config()).toBeNull();
  });
});

// ─── createR2Client ───────────────────────────────────────────────────────────

describe('createR2Client', () => {
  it('creates a client pointed at the Cloudflare R2 endpoint', async () => {
    const { S3Client } = await import('@aws-sdk/client-s3');
    const config = {
      accountId: 'abc123',
      accessKeyId: 'key',
      secretAccessKey: 'secret',
      bucketName: 'bucket',
      publicUrl: 'https://pub.r2.dev',
    };

    createR2Client(config);

    expect(S3Client).toHaveBeenCalledWith(
      expect.objectContaining({
        region: 'auto',
        endpoint: 'https://abc123.r2.cloudflarestorage.com',
        credentials: {
          accessKeyId: 'key',
          secretAccessKey: 'secret',
        },
      }),
    );
  });
});

// ─── uploadFile ───────────────────────────────────────────────────────────────

describe('uploadFile', () => {
  const config = {
    accountId: 'abc123',
    accessKeyId: 'key',
    secretAccessKey: 'secret',
    bucketName: 'my-bucket',
    publicUrl: 'https://pub-xxxx.r2.dev',
  };

  beforeEach(() => {
    mockSend.mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns the public URL of the uploaded object', async () => {
    const client = { send: mockSend } as never;
    const url = await uploadFile(client, config, '/local/large.webp', 'photos/test/large.webp');
    expect(url).toBe('https://pub-xxxx.r2.dev/photos/test/large.webp');
  });

  it('sets ContentType to image/webp for .webp files', async () => {
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const client = { send: mockSend } as never;

    await uploadFile(client, config, '/local/large.webp', 'photos/test/large.webp');

    expect(PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({ ContentType: 'image/webp' }),
    );
  });

  it('sets a long-lived CacheControl header', async () => {
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const client = { send: mockSend } as never;

    await uploadFile(client, config, '/local/large.webp', 'photos/test/large.webp');

    expect(PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  });
});

// ─── objectExists ─────────────────────────────────────────────────────────────

describe('objectExists', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when HeadObject succeeds', async () => {
    mockSend.mockResolvedValue({});
    const client = { send: mockSend } as never;
    const result = await objectExists(client, 'my-bucket', 'photos/test/large.webp');
    expect(result).toBe(true);
  });

  it('returns false when HeadObject throws (object not found)', async () => {
    mockSend.mockRejectedValue(new Error('NotFound'));
    const client = { send: mockSend } as never;
    const result = await objectExists(client, 'my-bucket', 'photos/test/large.webp');
    expect(result).toBe(false);
  });
});

// ─── uploadPhotoVariants ──────────────────────────────────────────────────────

describe('uploadPhotoVariants', () => {
  const config = {
    accountId: 'abc123',
    accessKeyId: 'key',
    secretAccessKey: 'secret',
    bucketName: 'my-bucket',
    publicUrl: 'https://pub-xxxx.r2.dev',
  };

  // mockReset (not clearAllMocks) to drain the once-queue between tests —
  // Promise.all runs all HeadObject checks concurrently before any PutObject
  // fires, so leftover once values from a previous test corrupt the next.
  beforeEach(() => {
    mockSend.mockReset();
  });

  it('uploads all four sizes and returns R2 URLs', async () => {
    // Promise.all fires all 4 HeadObject calls before any PutObject call.
    // Set up: 4 rejections (not found) → 4 resolutions (put succeeds).
    mockSend
      .mockRejectedValueOnce(new Error('NotFound')) // head: thumbnail
      .mockRejectedValueOnce(new Error('NotFound')) // head: medium
      .mockRejectedValueOnce(new Error('NotFound')) // head: large
      .mockRejectedValueOnce(new Error('NotFound')) // head: full
      .mockResolvedValueOnce({}) // put: thumbnail
      .mockResolvedValueOnce({}) // put: medium
      .mockResolvedValueOnce({}) // put: large
      .mockResolvedValueOnce({}); // put: full

    const client = { send: mockSend } as never;
    const { srcset, src } = await uploadPhotoVariants(client, config, 'morning-mist', '/local/photos/morning-mist');

    expect(srcset['thumbnail']).toBe('https://pub-xxxx.r2.dev/photos/morning-mist/thumbnail.webp');
    expect(srcset['large']).toBe('https://pub-xxxx.r2.dev/photos/morning-mist/large.webp');
    expect(srcset['full']).toBe('https://pub-xxxx.r2.dev/photos/morning-mist/full.webp');
    expect(src).toBe('https://pub-xxxx.r2.dev/photos/morning-mist/large.webp');
  });

  it('skips upload for sizes that already exist in R2', async () => {
    // All HeadObject calls succeed → no PutObject calls → exactly 4 sends total.
    mockSend.mockResolvedValue({});

    const client = { send: mockSend } as never;
    const { srcset } = await uploadPhotoVariants(client, config, 'morning-mist', '/local/photos/morning-mist');

    expect(mockSend).toHaveBeenCalledTimes(4);
    expect(srcset['large']).toBe('https://pub-xxxx.r2.dev/photos/morning-mist/large.webp');
  });
});
