'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: 'default' | 'scale';
}

export function ScrollReveal({
  children,
  delay = 0,
  className,
  variant = 'default',
}: ScrollRevealProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenClass = variant === 'scale' ? 'panel-reveal-hidden' : 'scroll-reveal-hidden';
  const visibleClass = variant === 'scale' ? 'panel-reveal-visible' : 'scroll-reveal-visible';

  return (
    <div
      ref={ref}
      className={cn(isVisible ? visibleClass : hiddenClass, className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
