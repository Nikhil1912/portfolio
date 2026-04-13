import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TrackTeaser } from './TrackTeaser';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TrackTeaser', () => {
  it('Engineering panel links to /work', () => {
    render(<TrackTeaser />);
    expect(screen.getByRole('link', { name: /engineering work/i })).toHaveAttribute('href', '/work');
  });

  it('Photography panel links to /gallery', () => {
    render(<TrackTeaser />);
    expect(screen.getByRole('link', { name: /photography gallery/i })).toHaveAttribute(
      'href',
      '/gallery',
    );
  });

  it('renders "The Work" section label', () => {
    render(<TrackTeaser />);
    expect(screen.getByText('The Work')).toBeInTheDocument();
  });

  it('renders "The Gallery" section label', () => {
    render(<TrackTeaser />);
    expect(screen.getByText('The Gallery')).toBeInTheDocument();
  });

  it('both panels are keyboard-navigable link elements', () => {
    render(<TrackTeaser />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    links.forEach((link) => expect(link.tagName).toBe('A'));
  });
});
