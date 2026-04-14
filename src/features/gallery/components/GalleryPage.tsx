'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ScrollReveal } from '@/components';
import { photos as allPhotos } from '../data/photos';
import { usePhotoLoader } from '../hooks/usePhotoLoader';
import { PhotoGrid } from './PhotoGrid';
import { LoadMoreButton } from './LoadMoreButton';

// Dynamically import the lightbox so it is excluded from the initial bundle.
const GalleryLightbox = dynamic(
  () => import('./GalleryLightbox').then((mod) => mod.GalleryLightbox),
  { ssr: false },
);

export function GalleryPage(): React.ReactElement {
  const { visiblePhotos, hasMore, loadMore } = usePhotoLoader(allPhotos);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      {/* Page header */}
      <ScrollReveal>
        <section aria-label="The Gallery" className="grain-texture relative px-8 pt-12 pb-10 lg:pt-16 lg:pb-12">

          <div className="max-w-[1200px] mx-auto">
            {/* B — thin vertical terracotta rule beside the heading */}
            <div className="flex items-start gap-5">
              <div className="w-0.5 h-14 shrink-0 bg-secondary mt-1" aria-hidden="true" />
              <div>
                <h1 className="text-display-lg text-secondary">The Gallery</h1>
                <p className="text-body-md text-on-surface-variant mt-4">
                  Analog light. Digital glass.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Photo grid */}
      <section aria-label="Photo grid" className="bg-surface-container-low">
        <div className="max-w-[1200px] mx-auto px-2 pt-2 pb-12">
          <PhotoGrid
            photos={visiblePhotos}
            onPhotoClick={(index) => setLightboxIndex(index)}
          />
          <div className="mt-8 flex justify-center">
            <LoadMoreButton hasMore={hasMore} onLoadMore={loadMore} />
          </div>
        </div>
      </section>

      {/* Lightbox — rendered outside the grid section to avoid stacking context issues */}
      <GalleryLightbox
        photos={visiblePhotos}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(index) => setLightboxIndex(index)}
      />
    </>
  );
}
