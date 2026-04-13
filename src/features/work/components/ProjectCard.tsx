import { cn } from '@/utils';
import { SkillTag } from './SkillTag';
import type { Project } from '../data/types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps): React.ReactElement {
  const { name, description, githubUrl, screenshotAlt, technologies } = project;
  const isEven = index % 2 === 0;

  return (
    <article
      className="bg-surface-container-lowest flex flex-col lg:flex-row"
      aria-label={`Project: ${name}`}
    >
      {/* Screenshot placeholder */}
      <div
        className={cn(
          'bg-surface-container-low min-h-48 lg:min-h-72 lg:w-5/12 flex items-center justify-center',
          !isEven && 'lg:order-last',
        )}
        aria-hidden="true"
      >
        <span className="text-label-sm text-on-surface-variant px-6 text-center">
          {screenshotAlt}
        </span>
      </div>

      {/* Text content */}
      <div className="flex flex-col justify-center p-8 lg:p-12 flex-1">
        <h3 className="text-headline-md text-on-surface">{name}</h3>
        <p className="text-body-md text-on-surface-variant mt-3 max-w-prose">{description}</p>
        <div className="mt-5">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center btn-press bg-transparent text-on-surface underline underline-offset-4 decoration-surface-tint decoration-2 px-2 py-1 text-label-sm hover:text-on-surface-variant focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface"
            aria-label={`View ${name} on GitHub`}
          >
            View on GitHub
          </a>
        </div>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {technologies.map((tech) => (
              <SkillTag key={tech} skill={tech} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
