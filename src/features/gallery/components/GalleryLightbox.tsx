'use client';

import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import type { Photo } from '@/types/photo';

interface GalleryLightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps): React.ReactElement | null {
  if (!isOpen) return null;

  const slides = photos.map((photo) => ({
    src: photo.src,
    width: photo.width,
    height: photo.height,
    alt: photo.alt,
  }));

  return (
    <Lightbox
      slides={slides}
      open={isOpen}
      index={currentIndex}
      close={onClose}
      on={{ view: ({ index }) => onNavigate(index) }}
      render={{ buttonZoom: () => null }}
      plugins={[Zoom]}
      styles={{ root: { '--yarl__color_backdrop': 'rgba(26, 28, 27, 0.95)' } }}
    />
  );
}
