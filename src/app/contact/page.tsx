import type { Metadata } from 'next';
import { ContactPage } from '@/features/contact';

export const metadata: Metadata = {
  title: 'Get in Touch',
};

export default function Contact(): React.ReactElement {
  return <ContactPage />;
}
