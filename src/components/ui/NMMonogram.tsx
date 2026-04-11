import { cn } from '@/utils';

interface NMMonogramProps {
  className?: string;
  size?: number;
}

export function NMMonogram({ className, size = 32 }: NMMonogramProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(className)}
    >
      {/* N — left vertical */}
      <line x1="9" y1="6" x2="9" y2="50" />
      {/* N — diagonal (right vertical is shared with M and removed) */}
      <line x1="9" y1="6" x2="31" y2="50" />
      {/* M — twin diagonals (left vertical shared with N, omitted) */}
      <polyline points="31,6 39,28 47,6" />
      {/* M — right vertical */}
      <line x1="47" y1="6" x2="47" y2="50" />
    </svg>
  );
}
