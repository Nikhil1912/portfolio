import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ContactPage } from './ContactPage';

vi.mock('../actions/sendMessage', () => ({
  sendMessage: vi.fn().mockResolvedValue({ success: true }),
}));

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ContactPage', () => {
  it('renders the page heading', () => {
    render(<ContactPage />);
    expect(
      screen.getByRole('heading', { name: 'Get in Touch', level: 1 }),
    ).toBeInTheDocument();
  });

  it('renders the contact form', () => {
    render(<ContactPage />);
    expect(
      screen.getByRole('form', { name: /contact form/i }),
    ).toBeInTheDocument();
  });

  it('renders the footer scroll hint link', () => {
    render(<ContactPage />);
    const hint = screen.getByRole('link', { name: /bottom of the page/i });
    expect(hint).toHaveAttribute('href', '#footer');
  });
});
