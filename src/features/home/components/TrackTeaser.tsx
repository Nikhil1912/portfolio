import Link from 'next/link';
import { SectionLabel, ScrollReveal } from '@/components';

export function TrackTeaser(): React.ReactElement {
  return (
    <ScrollReveal variant="scale">
      <section aria-label="Explore">
        <div className="flex flex-col lg:flex-row">
          {/* Engineering panel — ~45% width on desktop */}
          <Link
            href="/work"
            className="group flex flex-col justify-end px-8 pb-10 pt-12 lg:px-12 lg:pb-16 lg:pt-16 bg-surface-container-low w-full lg:w-5/12 min-h-64 lg:min-h-96 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-outline"
            aria-label="View engineering work"
          >
            <SectionLabel track="engineering">The Work</SectionLabel>
            <p className="text-body-md text-on-surface-variant mt-2 transition-colors group-hover:text-on-surface">
              Systems, interfaces, and the code behind them.
            </p>
          </Link>

          {/* Photography panel — ~55% width on desktop */}
          <Link
            href="/gallery"
            className="group flex flex-col justify-end px-8 pb-10 pt-12 lg:px-12 lg:pb-16 lg:pt-16 bg-surface-container-lowest flex-1 min-h-64 lg:min-h-96 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-outline"
            aria-label="View photography gallery"
          >
            <SectionLabel track="photography">The Gallery</SectionLabel>
            <p className="text-body-md text-on-surface-variant mt-2 transition-colors group-hover:text-on-surface">
              Street scenes and landscapes, chasing the light.
            </p>
          </Link>
        </div>
      </section>
    </ScrollReveal>
  );
}
