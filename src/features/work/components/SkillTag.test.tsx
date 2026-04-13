import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkillTag } from './SkillTag';

describe('SkillTag', () => {
  it('renders the skill text', () => {
    render(<SkillTag skill="TypeScript" />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SkillTag skill="React" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders as an inline span', () => {
    const { container } = render(<SkillTag skill="Node.js" />);
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });
});
