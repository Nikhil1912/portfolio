import { render, screen, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NavBar } from './NavBar';

const mockPathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function getDesktopNav() {
  return screen.getByRole('navigation', { name: 'Primary navigation' });
}

describe('NavBar', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');
  });

  it('renders Work, Gallery, and Contact links in desktop nav', () => {
    render(<NavBar />);
    const nav = getDesktopNav();
    expect(within(nav).getByRole('link', { name: 'Work' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Gallery' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('renders monogram link that points to home', () => {
    render(<NavBar />);
    const homeLink = screen.getByRole('link', { name: /nikhil mehra.*home/i });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('applies primary (green) underline on /work route', () => {
    mockPathname.mockReturnValue('/work');
    render(<NavBar />);
    const nav = getDesktopNav();
    expect(within(nav).getByRole('link', { name: 'Work' }).className).toContain('border-primary');
  });

  it('applies secondary (terracotta) underline on /gallery route', () => {
    mockPathname.mockReturnValue('/gallery');
    render(<NavBar />);
    const nav = getDesktopNav();
    expect(within(nav).getByRole('link', { name: 'Gallery' }).className).toContain('border-secondary');
  });

  it('applies neutral underline on /contact route', () => {
    mockPathname.mockReturnValue('/contact');
    render(<NavBar />);
    const nav = getDesktopNav();
    expect(within(nav).getByRole('link', { name: 'Contact' }).className).toContain('border-on-surface');
  });

  it('renders hamburger button for mobile', () => {
    render(<NavBar />);
    expect(screen.getByRole('button', { name: /open navigation/i })).toBeInTheDocument();
  });
});
