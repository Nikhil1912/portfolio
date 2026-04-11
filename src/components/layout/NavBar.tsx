'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NMMonogram } from '../ui/NMMonogram';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/utils';

const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

function HamburgerIcon(): React.ReactElement {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="2" y1="6" x2="20" y2="6" />
      <line x1="2" y1="11" x2="20" y2="11" />
      <line x1="2" y1="16" x2="20" y2="16" />
    </svg>
  );
}

function getActiveLinkColor(pathname: string, linkHref: string): string {
  if (pathname !== linkHref) return '';
  if (linkHref === '/work') return 'border-b-2 border-primary';
  if (linkHref === '/gallery') return 'border-b-2 border-secondary';
  return 'border-b-2 border-on-surface';
}

export function NavBar(): React.ReactElement {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 bg-surface h-16 flex items-center px-8',
          'transition-shadow duration-200',
          scrolled && 'shadow-nav-scroll',
        )}
      >
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
          {/* Monogram — links home */}
          <Link href="/" aria-label="Nikhil Mehra — Home" className="text-on-surface hover:text-on-surface-variant transition-colors">
            <NMMonogram size={28} />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-body-md text-on-surface hover:text-on-surface-variant transition-colors pb-1',
                  getActiveLinkColor(pathname, href),
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 text-on-surface hover:text-on-surface-variant transition-colors min-h-11 min-w-11 flex items-center justify-center"
          >
            <HamburgerIcon />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
