import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input, Select, Textarea } from './Input';

describe('Input', () => {
  it('renders label with correct text', () => {
    render(<Input id="name" label="Full Name" />);
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
  });

  it('associates label with input via id', () => {
    render(<Input id="email" label="Email Address" type="email" />);
    const input = screen.getByLabelText('Email Address');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('renders error message when provided', () => {
    render(<Input id="name" label="Name" error="Name is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required');
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input id="name" label="Name" error="Required" />);
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby pointing to error message', () => {
    render(<Input id="name" label="Name" error="Required" />);
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-describedby', 'name-error');
    expect(screen.getByRole('alert')).toHaveAttribute('id', 'name-error');
  });

  it('accepts user input', () => {
    render(<Input id="name" label="Name" />);
    const input = screen.getByLabelText('Name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Nikhil' } });
    expect(input.value).toBe('Nikhil');
  });
});

describe('Select', () => {
  it('renders label and associates it with select', () => {
    render(
      <Select id="reason" label="Reason">
        <option value="hi">Just Saying Hi</option>
      </Select>,
    );
    expect(screen.getByLabelText('Reason')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(
      <Select id="reason" label="Reason" error="Please select a reason">
        <option value="">Select</option>
      </Select>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Please select a reason');
  });
});

describe('Textarea', () => {
  it('renders label and associates it with textarea', () => {
    render(<Textarea id="message" label="Message" />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Textarea id="message" label="Message" error="Message is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Message is required');
  });

  it('accepts user input', () => {
    render(<Textarea id="message" label="Message" />);
    const textarea = screen.getByLabelText('Message') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hello!' } });
    expect(textarea.value).toBe('Hello!');
  });
});
