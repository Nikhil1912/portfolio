import { SkillTag } from './SkillTag';

interface SkillRibbonProps {
  skills: string[];
}

export function SkillRibbon({ skills }: SkillRibbonProps): React.ReactElement {
  return (
    <div className="overflow-x-auto" role="region" aria-label="All skills">
      <div className="flex gap-2 pb-1 min-w-0">
        {skills.map((skill) => (
          <SkillTag
            key={skill}
            skill={skill}
            className="shrink-0 bg-surface-container-lowest"
          />
        ))}
      </div>
    </div>
  );
}
