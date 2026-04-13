import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../data/types';

const project: Project = {
  id: 'helios',
  name: 'Helios',
  description: 'A type-safe SQL query builder for TypeScript.',
  githubUrl: 'https://github.com/nikhilmehra/helios',
  screenshotAlt: 'Helios code example',
  technologies: ['TypeScript', 'Node.js', 'SQL'],
};

describe('ProjectCard', () => {
  it('renders the project name', () => {
    render(<ProjectCard project={project} index={0} />);
    expect(screen.getByRole('heading', { name: 'Helios', level: 3 })).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<ProjectCard project={project} index={0} />);
    expect(
      screen.getByText('A type-safe SQL query builder for TypeScript.'),
    ).toBeInTheDocument();
  });

  it('renders the GitHub link with correct URL', () => {
    render(<ProjectCard project={project} index={0} />);
    const link = screen.getByRole('link', { name: /view helios on github/i });
    expect(link).toHaveAttribute('href', 'https://github.com/nikhilmehra/helios');
  });

  it('GitHub link opens in a new tab', () => {
    render(<ProjectCard project={project} index={0} />);
    const link = screen.getByRole('link', { name: /view helios on github/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders all technology tags', () => {
    render(<ProjectCard project={project} index={0} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('SQL')).toBeInTheDocument();
  });

  it('odd-indexed card moves image to the end on desktop', () => {
    const { container } = render(<ProjectCard project={project} index={1} />);
    const screenshotDiv = container.querySelector('[aria-hidden="true"]');
    expect(screenshotDiv).toHaveClass('lg:order-last');
  });

  it('even-indexed card does not move image to the end', () => {
    const { container } = render(<ProjectCard project={project} index={0} />);
    const screenshotDiv = container.querySelector('[aria-hidden="true"]');
    expect(screenshotDiv).not.toHaveClass('lg:order-last');
  });
});
