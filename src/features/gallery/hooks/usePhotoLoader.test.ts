import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePhotoLoader } from './usePhotoLoader';
import type { Photo } from '@/types/photo';

function makePhotos(count: number): Photo[] {
  return Array.from({ length: count }, (_, i) => {
    const id = `photo-${String(i).padStart(3, '0')}`;
    return {
      id,
      title: `Photo ${i + 1}`,
      category: 'landscape' as const,
      width: 1600,
      height: 900,
      src: `https://picsum.photos/seed/test${i}/1600/900`,
      alt: `Test photo ${i + 1}`,
      order: i + 1,
      placeholder: 'data:image/webp;base64,abc',
      srcset: {
        thumbnail: `https://picsum.photos/seed/test${i}/400/225`,
        medium: `https://picsum.photos/seed/test${i}/800/450`,
        large: `https://picsum.photos/seed/test${i}/1600/900`,
        full: `https://picsum.photos/seed/test${i}/1600/900`,
      },
    };
  });
}

describe('usePhotoLoader', () => {
  it('returns the first 16 photos on initial render', () => {
    const { result } = renderHook(() => usePhotoLoader(makePhotos(20)));
    expect(result.current.visiblePhotos).toHaveLength(16);
    expect(result.current.hasMore).toBe(true);
  });

  it('returns all photos when total is less than batch size', () => {
    const { result } = renderHook(() => usePhotoLoader(makePhotos(10)));
    expect(result.current.visiblePhotos).toHaveLength(10);
    expect(result.current.hasMore).toBe(false);
  });

  it('returns all photos when total equals batch size exactly', () => {
    const { result } = renderHook(() => usePhotoLoader(makePhotos(16)));
    expect(result.current.visiblePhotos).toHaveLength(16);
    expect(result.current.hasMore).toBe(false);
  });

  it('loads the next batch when loadMore is called', () => {
    const { result } = renderHook(() => usePhotoLoader(makePhotos(20)));
    act(() => result.current.loadMore());
    expect(result.current.visiblePhotos).toHaveLength(20);
    expect(result.current.hasMore).toBe(false);
  });

  it('does not exceed total photo count when loadMore is called on the last batch', () => {
    const { result } = renderHook(() => usePhotoLoader(makePhotos(18)));
    act(() => result.current.loadMore());
    expect(result.current.visiblePhotos).toHaveLength(18);
    expect(result.current.hasMore).toBe(false);
  });

  it('successive loadMore calls exhaust the list incrementally', () => {
    const { result } = renderHook(() => usePhotoLoader(makePhotos(40)));
    expect(result.current.visiblePhotos).toHaveLength(16);

    act(() => result.current.loadMore());
    expect(result.current.visiblePhotos).toHaveLength(32);
    expect(result.current.hasMore).toBe(true);

    act(() => result.current.loadMore());
    expect(result.current.visiblePhotos).toHaveLength(40);
    expect(result.current.hasMore).toBe(false);
  });
});
