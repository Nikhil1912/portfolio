import type { Metadata } from 'next';
import { WorkPage } from '@/features/work';

export const metadata: Metadata = {
  title: 'The Work — Nikhil Mehra',
  description: 'Software engineering experience, projects, and skills.',
};

export default function WorkRoutePage(): React.ReactElement {
  return <WorkPage />;
}
