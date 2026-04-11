import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Hero } from './Hero';

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Hero', () => {
  it('renders the name heading', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { name: 'Nikhil', level: 1 })).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Hero />);
    expect(screen.getByText('Code & Light')).toBeInTheDocument();
  });

  it('renders the intro copy', () => {
    render(<Hero />);
    expect(screen.getByText(/software engineer by trade/i)).toBeInTheDocument();
  });
});
