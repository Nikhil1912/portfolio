import { SkillTag } from './SkillTag';
import type { Experience } from '../data/types';

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps): React.ReactElement {
  const { company, title, startDate, endDate, description, skills, isCurrent } = experience;
  const dateRange = endDate ? `${startDate} – ${endDate}` : `${startDate} – Present`;

  if (isCurrent) {
    return (
      <article aria-label={`Current role at ${company}`}>
        <p className="text-label-sm text-on-surface-variant mb-2">{dateRange}</p>
        <h3 className="text-headline-md text-on-surface">{company}</h3>
        <p className="text-body-md text-on-surface mt-1" style={{ fontWeight: 600 }}>
          {title}
        </p>
        <p className="text-body-md text-on-surface-variant mt-3 max-w-2xl">{description}</p>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4" aria-label="Skills used in this role">
            {skills.map((skill) => (
              <SkillTag key={skill} skill={skill} className="bg-surface-container-lowest" />
            ))}
          </div>
        )}
      </article>
    );
  }

  return (
    <article aria-label={`Previous role at ${company}`}>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
        <span className="text-body-md text-on-surface" style={{ fontWeight: 600 }}>
          {company}
        </span>
        <span className="text-body-md text-on-surface-variant">{title}</span>
        <span className="text-label-sm text-on-surface-variant sm:ml-auto shrink-0">{dateRange}</span>
      </div>
      <p className="text-body-md text-on-surface-variant mt-2 max-w-2xl">{description}</p>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3" aria-label="Skills used in this role">
          {skills.map((skill) => (
            <SkillTag key={skill} skill={skill} className="bg-surface-container-lowest" />
          ))}
        </div>
      )}
    </article>
  );
}
