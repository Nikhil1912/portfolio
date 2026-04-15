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
    // Pass through the extra fields so our render function can reach them
    placeholder: photo.placeholder,
    srcset: photo.srcset,
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
        image: ({ alt, src, srcSet, sizes, style, className, onClick }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={alt}
            src={src}
            srcSet={srcSet}
            sizes={sizes ?? '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw'}
            style={style}
            className={`${className ?? ''} block cursor-pointer opacity-0 transition-opacity duration-300`}
            onClick={onClick}
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
