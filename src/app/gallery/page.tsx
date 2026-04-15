import type { Metadata } from 'next';
import { GalleryPage } from '@/features/gallery';
import photosData from '../../../public/photos.json';
import type { Photo } from '@/types/photo';

export const metadata: Metadata = {
  title: 'The Gallery — Nikhil Mehra',
  description: 'Street scenes and landscapes in a browsable photo gallery.',
};

export default function GalleryRoutePage(): React.ReactElement {
  const photos = photosData as Photo[];
  return <GalleryPage photos={photos} />;
}
