import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { MobileMenu } from './MobileMenu';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...props }: { href: string; children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

describe('MobileMenu', () => {
  it('is hidden when closed', () => {
    render(<MobileMenu isOpen={false} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog.className).toContain('-translate-y-full');
  });

  it('is visible when open', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('translate-y-0');
  });

  it('renders nav links when open', () => {
    render(<MobileMenu isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('link', { name: 'Work' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Gallery' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when a nav link is clicked', () => {
    const onClose = vi.fn();
    render(<MobileMenu isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('link', { name: 'Work' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
