'use client';

import { RowsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/rows.css';
import type { Photo } from '@/types/photo';

interface PhotoGridProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

export function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps): React.ReactElement {
  const albumPhotos = photos.map((photo) => ({
    src: photo.src,
    width: photo.width,
    height: photo.height,
    alt: photo.alt,
    key: photo.id,
  }));

  return (
    <RowsPhotoAlbum
      photos={albumPhotos}
      targetRowHeight={(containerWidth) => {
        if (containerWidth < 768) return 200;
        if (containerWidth < 1024) return 240;
        return 280;
      }}
      spacing={8}
      onClick={({ index }) => onPhotoClick(index)}
      render={{
        // Custom image rendering for the fade-in-on-load effect.
        // Using <img> directly is intentional: react-photo-album's justified layout
        // sets exact pixel dimensions, and Phase 7 will add our own srcset pipeline.
        image: ({ alt, ...rest }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...rest}
            alt={alt}
            className="block cursor-pointer opacity-0 transition-opacity duration-300"
            onLoad={(e) => {
              e.currentTarget.classList.remove('opacity-0');
              e.currentTarget.classList.add('opacity-100');
            }}
          />
        ),
      }}
    />
  );
}
