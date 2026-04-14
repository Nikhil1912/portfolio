import type { Metadata } from 'next';
import { GalleryPage } from '@/features/gallery';

export const metadata: Metadata = {
  title: 'The Gallery — Nikhil Mehra',
  description: 'Street scenes and landscapes in a browsable photo gallery.',
};

export default function GalleryRoutePage(): React.ReactElement {
  return <GalleryPage />;
}
