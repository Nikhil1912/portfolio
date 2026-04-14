'use client';

import { useState, useTransition } from 'react';
import { Input, Select, Textarea, Button } from '@/components';
import { sendMessage, type ContactPayload } from '../actions/sendMessage';

// ─── Validation ───────────────────────────────────────────────────

interface FormErrors {
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
}

function validate(values: ContactPayload): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) {
    errors.name = 'Name is required';
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!values.reason) {
    errors.reason = 'Please select a reason';
  }
  if (!values.message.trim()) {
    errors.message = 'Message is required';
  }
  return errors;
}

// ─── Success state ────────────────────────────────────────────────

function CheckIcon(): React.ReactElement {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 26l8 8 12-14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-check"
      />
    </svg>
  );
}

function SuccessState(): React.ReactElement {
  return (
    <div
      className="animate-success flex flex-col items-center gap-6 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="text-on-surface">
        <CheckIcon />
      </div>
      <div>
        <p className="text-headline-md text-on-surface">
          Thanks! I&apos;ll get back to you soon.
        </p>
        <p className="text-body-md text-on-surface-variant mt-2">
          Your message has been sent.
        </p>
      </div>
    </div>
  );
}

// ─── ContactForm ──────────────────────────────────────────────────

export function ContactForm(): React.ReactElement {
  const [values, setValues] = useState<ContactPayload>({
    name: '',
    email: '',
    reason: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChange =
    (field: keyof ContactPayload) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear the field error as soon as the user edits it
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setSubmitError(null);
    startTransition(async () => {
      const result = await sendMessage(values);
      if (result.success) {
        setSucceeded(true);
      } else {
        setSubmitError(result.error ?? 'Something went wrong. Please try again.');
      }
    });
  };

  if (succeeded) return <SuccessState />;

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <div className="flex flex-col gap-8">
        <Input
          id="name"
          label="Name"
          type="text"
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
          autoComplete="name"
        />
        <Input
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
        />
        <Select
          id="reason"
          label="Reason"
          value={values.reason}
          onChange={handleChange('reason')}
          error={errors.reason}
        >
          <option value="" disabled>
            Select a reason
          </option>
          <option value="Freelance / Contract">Freelance / Contract</option>
          <option value="Photography Inquiry">Photography Inquiry</option>
          <option value="Just Saying Hi">Just Saying Hi</option>
          <option value="Other">Other</option>
        </Select>
        <Textarea
          id="message"
          label="Message"
          value={values.message}
          onChange={handleChange('message')}
          error={errors.message}
          rows={5}
        />
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            aria-disabled={isPending}
          >
            {isPending ? 'Sending\u2026' : 'Send Message'}
          </Button>
          {submitError && (
            <p role="alert" className="text-label-sm text-error">
              {submitError}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
