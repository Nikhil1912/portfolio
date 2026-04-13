import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WorkPage } from './WorkPage';
import { experiences } from '../data/experience';
import { projects } from '../data/projects';

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('WorkPage', () => {
  it('renders the page heading', () => {
    render(<WorkPage />);
    expect(screen.getByRole('heading', { name: 'The Work', level: 1 })).toBeInTheDocument();
  });

  it('renders all experience entries', () => {
    render(<WorkPage />);
    experiences.forEach((exp) => {
      expect(screen.getByText(exp.company)).toBeInTheDocument();
    });
  });

  it('renders all project cards', () => {
    render(<WorkPage />);
    projects.forEach((project) => {
      expect(screen.getByRole('heading', { name: project.name, level: 3 })).toBeInTheDocument();
    });
  });

  it('resume download link has correct href', () => {
    render(<WorkPage />);
    const link = screen.getByRole('link', { name: /download resume pdf/i });
    expect(link).toHaveAttribute('href', '/resume.pdf');
  });

  it('resume download link has download attribute', () => {
    render(<WorkPage />);
    const link = screen.getByRole('link', { name: /download resume pdf/i });
    expect(link).toHaveAttribute('download');
  });

  it('renders the Experience section', () => {
    render(<WorkPage />);
    expect(screen.getByRole('region', { name: 'Experience' })).toBeInTheDocument();
  });

  it('renders the Projects section', () => {
    render(<WorkPage />);
    expect(screen.getByRole('region', { name: 'Projects' })).toBeInTheDocument();
  });

  it('all project GitHub links are present', () => {
    render(<WorkPage />);
    projects.forEach((project) => {
      const link = screen.getByRole('link', { name: new RegExp(`view ${project.name} on github`, 'i') });
      expect(link).toHaveAttribute('href', project.githubUrl);
    });
  });
});
