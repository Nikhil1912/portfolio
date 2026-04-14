import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Teach tailwind-merge that our composite typography utilities (text-display-lg etc.)
// are font-size classes, not text-color classes — so they don't conflict with
// text-on-primary, text-on-surface, etc. and both can coexist on the same element.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-display-lg', 'text-headline-md', 'text-body-md', 'text-label-sm'],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
