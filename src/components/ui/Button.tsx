import { cn } from '@/utils';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-on-primary rounded-none px-6 py-3 text-label-sm hover:bg-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  secondary:
    'bg-secondary text-on-secondary rounded-md px-6 py-3 text-label-sm hover:bg-secondary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
  tertiary:
    'bg-transparent text-on-surface underline underline-offset-4 decoration-surface-tint decoration-2 px-2 py-1 text-label-sm hover:text-on-surface-variant focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-surface',
};

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={cn('inline-flex items-center justify-center btn-press cursor-pointer', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
