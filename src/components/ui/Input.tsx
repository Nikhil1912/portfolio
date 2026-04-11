import { cn } from '@/utils';

// ─── Text Input ──────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  accent?: 'engineering' | 'photography';
}

export function Input({
  label,
  id,
  error,
  accent = 'engineering',
  className,
  ...props
}: InputProps): React.ReactElement {
  const focusColor = accent === 'engineering' ? 'focus:border-primary' : 'focus:border-secondary';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-label-sm text-on-surface-variant">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'bg-transparent border-b border-outline-variant text-body-md text-on-surface py-2 outline-none',
          'transition-colors duration-200',
          focusColor,
          error && 'border-error',
          className,
        )}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} role="alert" className="text-label-sm text-error">
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Select ──────────────────────────────────────────────────────

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  error?: string;
  accent?: 'engineering' | 'photography';
  children: React.ReactNode;
}

export function Select({
  label,
  id,
  error,
  accent = 'engineering',
  className,
  children,
  ...props
}: SelectProps): React.ReactElement {
  const focusColor = accent === 'engineering' ? 'focus:border-primary' : 'focus:border-secondary';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-label-sm text-on-surface-variant">
        {label}
      </label>
      <select
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'bg-transparent border-b border-outline-variant text-body-md text-on-surface py-2 outline-none appearance-none cursor-pointer',
          'transition-colors duration-200',
          focusColor,
          error && 'border-error',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span id={`${id}-error`} role="alert" className="text-label-sm text-error">
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Textarea ────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  accent?: 'engineering' | 'photography';
}

export function Textarea({
  label,
  id,
  error,
  accent = 'engineering',
  className,
  ...props
}: TextareaProps): React.ReactElement {
  const focusColor = accent === 'engineering' ? 'focus:border-primary' : 'focus:border-secondary';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-label-sm text-on-surface-variant">
        {label}
      </label>
      <textarea
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'bg-transparent border-b border-outline-variant text-body-md text-on-surface py-2 outline-none resize-none',
          'transition-colors duration-200',
          focusColor,
          error && 'border-error',
          className,
        )}
        {...props}
      />
      {error && (
        <span id={`${id}-error`} role="alert" className="text-label-sm text-error">
          {error}
        </span>
      )}
    </div>
  );
}
