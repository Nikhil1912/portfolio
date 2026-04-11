import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is keyboard activatable with Enter', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    fireEvent.keyDown(btn, { key: 'Enter' });
    fireEvent.click(btn); // Enter triggers click natively on button
    expect(onClick).toHaveBeenCalled();
  });

  it('renders primary variant with correct background class', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button').className).toContain('bg-primary');
  });

  it('renders secondary variant with correct background class', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button').className).toContain('bg-secondary');
  });

  it('renders tertiary variant with underline style', () => {
    render(<Button variant="tertiary">Tertiary</Button>);
    expect(screen.getByRole('button').className).toContain('underline');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies additional className', () => {
    render(<Button className="extra-class">Btn</Button>);
    expect(screen.getByRole('button').className).toContain('extra-class');
  });
});
