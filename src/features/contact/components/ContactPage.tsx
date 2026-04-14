import { ScrollReveal } from '@/components';
import { ContactForm } from './ContactForm';

export function ContactPage(): React.ReactElement {
  return (
    <main>
      {/* Page header */}
      <ScrollReveal>
        <section
          aria-label="Get in Touch"
          className="px-8 pt-12 pb-10 lg:pt-16 lg:pb-12"
        >
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-start gap-5">
              <div className="w-0.5 h-14 shrink-0 bg-primary mt-1" aria-hidden="true" />
              <div className="flex-1">
                <h1 className="text-display-lg text-primary">Get in Touch</h1>
                <p className="text-body-md text-on-surface-variant mt-4 max-w-lg">
                  The inbox is open.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Asymmetric split — context left, form right */}
      <section
        aria-label="Contact form"
        className="px-8 pb-16 lg:pb-24"
      >
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal delay={100}>
            <div className="flex flex-col lg:flex-row">

              {/* Left panel — context */}
              <div className="bg-surface-container-low p-8 lg:p-10 lg:w-2/5 flex flex-col gap-8 lg:justify-between">
                <div className="flex flex-col gap-4">
                  <h2 className="text-headline-md text-on-surface">
                    Let&apos;s talk.
                  </h2>
                  <p className="text-body-md text-on-surface-variant">
                    Open to photography inquiries, honest conversations, and the
                    right opportunity when it comes along. Fill out the form
                    &mdash; I&apos;ll get back to you.
                  </p>
                </div>
                <a
                  href="#footer"
                  className="text-label-sm text-on-surface-variant hover:text-on-surface transition-colors duration-200"
                >
                  Or find me at the bottom of the page ↓
                </a>
              </div>

              {/* Right panel — form */}
              <div className="bg-surface-container-lowest p-8 lg:p-10 lg:w-3/5">
                <ContactForm />
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
