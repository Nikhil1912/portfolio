import { cn } from '@/utils';

interface SkillTagProps {
  skill: string;
  className?: string;
}

export function SkillTag({ skill, className }: SkillTagProps): React.ReactElement {
  return (
    <span
      className={cn(
        'inline-block text-label-sm text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-sm',
        className,
      )}
    >
      {skill}
    </span>
  );
}
