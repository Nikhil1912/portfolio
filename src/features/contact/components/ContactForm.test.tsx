import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ContactForm } from './ContactForm';

vi.mock('../actions/sendMessage', () => ({
  sendMessage: vi.fn().mockResolvedValue({ success: true }),
}));

import { sendMessage } from '../actions/sendMessage';

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(sendMessage).mockResolvedValue({ success: true });
});

describe('ContactForm', () => {
  it('renders all form fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^reason$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message$/i)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<ContactForm />);
    expect(
      screen.getByRole('button', { name: /send message/i }),
    ).toBeInTheDocument();
  });

  it('shows validation errors when submitting an empty form', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Please select a reason')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  it('shows email format validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/^email$/i), 'not-an-email');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(
      await screen.findByText(/valid email/i),
    ).toBeInTheDocument();
  });

  it('does not submit if validation fails', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    await screen.findByText('Name is required');
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it('calls sendMessage with correct values on valid submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^name$/i), 'Nikhil');
    await user.type(screen.getByLabelText(/^email$/i), 'nikhil@example.com');
    await user.selectOptions(screen.getByLabelText(/^reason$/i), 'Just Saying Hi');
    await user.type(screen.getByLabelText(/^message$/i), 'Hello there!');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledWith({
        name: 'Nikhil',
        email: 'nikhil@example.com',
        reason: 'Just Saying Hi',
        message: 'Hello there!',
      });
    });
  });

  it('shows success state after successful submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^name$/i), 'Nikhil');
    await user.type(screen.getByLabelText(/^email$/i), 'nikhil@example.com');
    await user.selectOptions(screen.getByLabelText(/^reason$/i), 'Just Saying Hi');
    await user.type(screen.getByLabelText(/^message$/i), 'Hello there!');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/thanks/i)).toBeInTheDocument();
    // Form is replaced — submit button should be gone
    expect(
      screen.queryByRole('button', { name: /send message/i }),
    ).not.toBeInTheDocument();
  });

  it('shows inline error below submit button on server failure', async () => {
    vi.mocked(sendMessage).mockResolvedValue({
      success: false,
      error: 'Failed to send message. Please try again.',
    });
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/^name$/i), 'Nikhil');
    await user.type(screen.getByLabelText(/^email$/i), 'nikhil@example.com');
    await user.selectOptions(screen.getByLabelText(/^reason$/i), 'Just Saying Hi');
    await user.type(screen.getByLabelText(/^message$/i), 'Hello there!');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(
      await screen.findByText('Failed to send message. Please try again.'),
    ).toBeInTheDocument();
    // Form remains visible after error
    expect(
      screen.getByRole('button', { name: /send message/i }),
    ).toBeInTheDocument();
  });

  it('clears a field validation error when the user starts typing in that field', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // Trigger name error
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();

    // Start typing in the name field — error should clear
    await user.type(screen.getByLabelText(/^name$/i), 'N');
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });
});
