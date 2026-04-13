import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkillRibbon } from './SkillRibbon';

const skills = ['TypeScript', 'React', 'Node.js', 'AWS', 'PostgreSQL'];

describe('SkillRibbon', () => {
  it('renders all skill tags', () => {
    render(<SkillRibbon skills={skills} />);
    skills.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it('renders the accessible region', () => {
    render(<SkillRibbon skills={skills} />);
    expect(screen.getByRole('region', { name: 'All skills' })).toBeInTheDocument();
  });

  it('container has horizontal overflow scrolling', () => {
    render(<SkillRibbon skills={skills} />);
    const region = screen.getByRole('region', { name: 'All skills' });
    expect(region).toHaveClass('overflow-x-auto');
  });

  it('renders nothing when skills array is empty', () => {
    const { container } = render(<SkillRibbon skills={[]} />);
    expect(container.querySelectorAll('span').length).toBe(0);
  });
});
