import { ScrollReveal } from '@/components';

export function Hero(): React.ReactElement {
  return (
    <ScrollReveal>
      <section aria-label="Introduction" className="px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-start gap-5">
            <div className="w-0.5 h-14 shrink-0 bg-on-surface mt-1" aria-hidden="true" />
            <div className="flex-1">
              <h1 className="text-display-lg text-on-surface">Nikhil</h1>
              <p className="text-headline-md text-on-surface-variant mt-4 ml-8 lg:ml-20">
                Code &amp; Light
              </p>
              <p className="text-body-md text-on-surface-variant mt-6 ml-12 lg:ml-32 max-w-lg">
                Software engineer by trade, photographer by instinct. I build web
                applications and chase light.
              </p>
            </div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
