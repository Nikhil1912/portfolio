import { cn } from '@/utils';

type Track = 'engineering' | 'photography' | 'neutral';

interface SectionLabelProps {
  children: React.ReactNode;
  track?: Track;
  className?: string;
}

const trackClasses: Record<Track, string> = {
  engineering: 'text-primary',
  photography: 'text-secondary',
  neutral: 'text-on-surface-variant',
};

export function SectionLabel({
  children,
  track = 'neutral',
  className,
}: SectionLabelProps): React.ReactElement {
  return (
    <span className={cn('text-label-sm', trackClasses[track], className)}>
      {children}
    </span>
  );
}
