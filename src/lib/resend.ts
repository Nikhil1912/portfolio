import { Resend } from 'resend';

// Instantiate lazily so build/tests don't crash when RESEND_API_KEY is unset.
export function getResendClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(process.env.RESEND_API_KEY);
}
