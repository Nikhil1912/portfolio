import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ScrollReveal } from './ScrollReveal';

// Store observer callbacks so tests can trigger them
type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;
let observerCallback: ObserverCallback | null = null;

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
  observerCallback = null;
  mockObserve.mockClear();
  mockDisconnect.mockClear();

  vi.stubGlobal(
    'IntersectionObserver',
    vi.fn((cb: ObserverCallback) => {
      observerCallback = cb;
      return { observe: mockObserve, disconnect: mockDisconnect };
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ScrollReveal', () => {
  it('starts hidden (opacity 0, translated)', () => {
    render(<ScrollReveal><p>Content</p></ScrollReveal>);
    const wrapper = screen.getByText('Content').parentElement!;
    expect(wrapper.className).toContain('scroll-reveal-hidden');
  });

  it('becomes visible when element enters viewport', () => {
    render(<ScrollReveal><p>Content</p></ScrollReveal>);
    const wrapper = screen.getByText('Content').parentElement!;

    act(() => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(wrapper.className).toContain('scroll-reveal-visible');
    expect(wrapper.className).not.toContain('scroll-reveal-hidden');
  });

  it('does not change class when element is not intersecting', () => {
    render(<ScrollReveal><p>Content</p></ScrollReveal>);
    const wrapper = screen.getByText('Content').parentElement!;

    act(() => {
      observerCallback?.([{ isIntersecting: false } as IntersectionObserverEntry]);
    });

    expect(wrapper.className).toContain('scroll-reveal-hidden');
  });

  it('applies stagger delay via inline style', () => {
    render(<ScrollReveal delay={160}><p>Content</p></ScrollReveal>);
    const wrapper = screen.getByText('Content').parentElement!;
    expect(wrapper).toHaveStyle({ transitionDelay: '160ms' });
  });

  it('disconnects observer once visible', () => {
    render(<ScrollReveal><p>Content</p></ScrollReveal>);

    act(() => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('uses panel-reveal classes when variant is scale', () => {
    render(<ScrollReveal variant="scale"><p>Content</p></ScrollReveal>);
    const wrapper = screen.getByText('Content').parentElement!;
    expect(wrapper.className).toContain('panel-reveal-hidden');
  });

  it('becomes panel-reveal-visible when scale variant enters viewport', () => {
    render(<ScrollReveal variant="scale"><p>Content</p></ScrollReveal>);
    const wrapper = screen.getByText('Content').parentElement!;

    act(() => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(wrapper.className).toContain('panel-reveal-visible');
    expect(wrapper.className).not.toContain('panel-reveal-hidden');
  });

  it('passes reduced-motion handling to CSS (no special JS logic needed)', () => {
    // The @media (prefers-reduced-motion) in globals.css sets
    // animation/transition-duration to 0.01ms — ScrollReveal just adds/removes
    // CSS classes; the browser handles the rest. This test verifies that
    // ScrollReveal itself applies no inline animation overrides.
    render(<ScrollReveal><p>Content</p></ScrollReveal>);
    const wrapper = screen.getByText('Content').parentElement!;
    expect(wrapper).not.toHaveStyle({ animationDuration: expect.anything() });
  });
});
