'use client';

import { useState } from 'react';
import type { Photo } from '@/types/photo';

const BATCH_SIZE = 16;

interface UsePhotoLoaderResult {
  visiblePhotos: Photo[];
  hasMore: boolean;
  loadMore: () => void;
}

export function usePhotoLoader(allPhotos: Photo[]): UsePhotoLoaderResult {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const visiblePhotos = allPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < allPhotos.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, allPhotos.length));
  };

  return { visiblePhotos, hasMore, loadMore };
}
