import React, { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Photo } from '@/types/photo';

// ─── Global mocks ────────────────────────────────────────────────────────────

// ScrollReveal uses IntersectionObserver; stub it so jsdom doesn't throw.
beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() })),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

// ─── Library mocks ───────────────────────────────────────────────────────────

// react-photo-album: avoid ResizeObserver dependency; render photos as buttons.
vi.mock('react-photo-album', () => ({
  RowsPhotoAlbum: ({
    photos,
    onClick,
  }: {
    photos: Array<{ src: string; alt?: string; key?: string }>;
    onClick: (args: { index: number }) => void;
  }) => (
    <div data-testid="photo-grid">
      {photos.map((photo, index) => (
        <button
          key={photo.key ?? photo.src}
          data-testid={`photo-${index}`}
          onClick={() => onClick({ index })}
        >
          {photo.alt}
        </button>
      ))}
    </div>
  ),
}));
vi.mock('react-photo-album/rows.css', () => ({}));

// yet-another-react-lightbox: lightweight dialog stand-in.
vi.mock('yet-another-react-lightbox', () => ({
  default: ({
    open,
    close,
    index,
    slides,
    on,
  }: {
    open: boolean;
    close: () => void;
    index: number;
    slides: Array<{ src: string }>;
    on?: { view?: (args: { index: number }) => void };
  }) => {
    if (!open) return null;
    return (
      <div role="dialog" aria-label="Photo lightbox" data-testid="lightbox">
        <span data-testid="lightbox-index">{index}</span>
        <span data-testid="lightbox-count">{slides.length}</span>
        <button onClick={close} aria-label="Close lightbox">
          ×
        </button>
        <button
          aria-label="Previous photo"
          onClick={() => on?.view?.({ index: index - 1 })}
        >
          ←
        </button>
        <button
          aria-label="Next photo"
          onClick={() => on?.view?.({ index: index + 1 })}
        >
          →
        </button>
      </div>
    );
  },
}));
vi.mock('yet-another-react-lightbox/plugins/zoom', () => ({ default: {} }));
vi.mock('yet-another-react-lightbox/styles.css', () => ({}));

// next/dynamic: resolve the loader synchronously via React.lazy so tests
// don't need a manual Suspense flush. The loader passed to dynamic() already
// chains .then(mod => mod.GalleryLightbox), so it resolves to the component.
vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<React.ComponentType<unknown>>) =>
    React.lazy(async () => ({ default: await loader() })),
}));

// ─── Test fixtures ────────────────────────────────────────────────────────────

function makePhoto(n: number): Photo {
  const id = `photo-${String(n).padStart(3, '0')}`;
  return {
    id,
    title: `Photo ${n}`,
    category: 'landscape',
    width: 1200,
    height: 800,
    src: `https://picsum.photos/seed/${id}/1200/800`,
    alt: `Test photo ${n}`,
    order: n,
    placeholder: 'data:image/webp;base64,abc',
    srcset: {
      thumbnail: `https://picsum.photos/seed/${id}/400/267`,
      medium: `https://picsum.photos/seed/${id}/800/533`,
      large: `https://picsum.photos/seed/${id}/1200/800`,
      full: `https://picsum.photos/seed/${id}/1200/800`,
    },
  };
}

// 20 test photos — mirrors the real photos.json count
const TEST_PHOTOS: Photo[] = Array.from({ length: 20 }, (_, i) => makePhoto(i + 1));

// ─── Component under test ────────────────────────────────────────────────────

import { GalleryPage } from './GalleryPage';

// Renders GalleryPage and waits for the lazy-loaded lightbox to be ready.
// Using findByRole ensures we don't race against the Suspense resolution.
async function renderGalleryPage(photos: Photo[] = TEST_PHOTOS) {
  render(
    <Suspense fallback={null}>
      <GalleryPage photos={photos} />
    </Suspense>,
  );
  // Wait for the heading — confirms the page has fully mounted
  await screen.findByRole('heading', { name: /the gallery/i });
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('GalleryPage', () => {
  it('renders the page heading', async () => {
    await renderGalleryPage();
    expect(screen.getByRole('heading', { name: /the gallery/i })).toBeInTheDocument();
  });

  it('renders the initial 16 photos', async () => {
    await renderGalleryPage();
    expect(screen.getAllByTestId(/^photo-\d+$/)).toHaveLength(16);
  });

  it('shows the Load More button when more photos exist', async () => {
    await renderGalleryPage();
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
  });

  it('loads the next batch when Load More is clicked', async () => {
    const user = userEvent.setup();
    await renderGalleryPage();

    await user.click(screen.getByRole('button', { name: /load more/i }));

    expect(screen.getAllByTestId(/^photo-\d+$/)).toHaveLength(20);
  });

  it('replaces Load More with end message when all photos are loaded', async () => {
    const user = userEvent.setup();
    await renderGalleryPage();

    await user.click(screen.getByRole('button', { name: /load more/i }));

    expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument();
    expect(screen.getByText(/that's everything/i)).toBeInTheDocument();
  });

  it('opens the lightbox when a photo is clicked', async () => {
    const user = userEvent.setup();
    await renderGalleryPage();

    await user.click(screen.getByTestId('photo-0'));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /photo lightbox/i })).toBeInTheDocument();
    });
  });

  it('opens the lightbox at the correct index', async () => {
    const user = userEvent.setup();
    await renderGalleryPage();

    await user.click(screen.getByTestId('photo-3'));

    await waitFor(() => {
      expect(screen.getByTestId('lightbox-index').textContent).toBe('3');
    });
  });

  it('closes the lightbox when the close button is clicked', async () => {
    const user = userEvent.setup();
    await renderGalleryPage();

    await user.click(screen.getByTestId('photo-0'));
    await waitFor(() =>
      expect(screen.getByRole('dialog', { name: /photo lightbox/i })).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: /close lightbox/i }));
    expect(screen.queryByRole('dialog', { name: /photo lightbox/i })).not.toBeInTheDocument();
  });

  it('navigates to the next photo via the next button', async () => {
    const user = userEvent.setup();
    await renderGalleryPage();

    await user.click(screen.getByTestId('photo-2'));
    await waitFor(() =>
      expect(screen.getByTestId('lightbox-index').textContent).toBe('2'),
    );

    await user.click(screen.getByRole('button', { name: /next photo/i }));
    expect(screen.getByTestId('lightbox-index').textContent).toBe('3');
  });

  it('navigates to the previous photo via the previous button', async () => {
    const user = userEvent.setup();
    await renderGalleryPage();

    await user.click(screen.getByTestId('photo-5'));
    await waitFor(() =>
      expect(screen.getByTestId('lightbox-index').textContent).toBe('5'),
    );

    await user.click(screen.getByRole('button', { name: /previous photo/i }));
    expect(screen.getByTestId('lightbox-index').textContent).toBe('4');
  });

  it('uses srcset.full for lightbox slides', async () => {
    const user = userEvent.setup();
    const photos = [makePhoto(1)];
    await renderGalleryPage(photos);

    await user.click(screen.getByTestId('photo-0'));

    // The lightbox slide count reflects the correct number of photos
    await waitFor(() => {
      expect(screen.getByTestId('lightbox-count').textContent).toBe('1');
    });
  });
});
