import { SectionLabel, ScrollReveal } from '@/components';
import { experiences } from '../data/experience';
import { projects } from '../data/projects';
import { ExperienceCard } from './ExperienceCard';
import { ProjectCard } from './ProjectCard';

export function WorkPage(): React.ReactElement {
  return (
    <>
      {/* Page header */}
      <ScrollReveal>
        <section aria-label="The Work" className="px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-start gap-5">
              <div className="w-0.5 h-14 shrink-0 bg-primary mt-1" aria-hidden="true" />
              <div className="flex-1">
                <h1 className="text-display-lg text-primary">The Work</h1>
                <p className="text-body-md text-on-surface-variant mt-4 max-w-lg">
                  What I build, and where I&apos;ve built it.
                </p>
                <div className="mt-8">
                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex items-center btn-press bg-primary text-on-primary rounded-none px-6 py-3 text-label-sm hover:bg-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    aria-label="Download resume PDF"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Experience */}
      <section aria-label="Experience" className="bg-surface-container-low px-8">
        <div className="max-w-[1200px] mx-auto pt-12 pb-10 lg:pt-16 lg:pb-12">
          <h2 className="mb-8">
            <SectionLabel track="engineering">Experience</SectionLabel>
          </h2>
          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <ScrollReveal key={exp.id} delay={i * 80}>
                <ExperienceCard experience={exp} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section aria-label="Projects" className="bg-surface px-8">
        <div className="max-w-[1200px] mx-auto pt-12 pb-20 lg:pt-16 lg:pb-24">
          <ScrollReveal>
            <h2 className="mb-10">
              <SectionLabel track="engineering">Projects</SectionLabel>
            </h2>
          </ScrollReveal>
          <div className="space-y-12 lg:space-y-16">
            {projects.map((project, i) => (
              <ScrollReveal
                key={project.id}
                variant={i % 2 === 0 ? 'slide-left' : 'slide-right'}
              >
                <ProjectCard project={project} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
