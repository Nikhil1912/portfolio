'use server';

import { getResendClient } from '@/lib/resend';

export interface ContactPayload {
  name: string;
  email: string;
  reason: string;
  message: string;
}

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function sendMessage(payload: ContactPayload): Promise<ActionResult> {
  const to = process.env.CONTACT_EMAIL_TO;
  if (!to) {
    return { success: false, error: 'Contact email is not configured.' };
  }

  try {
    const resend = getResendClient();

    // Notify the site owner
    const ownerEmail = resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to,
      subject: `New message: ${payload.reason}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Reason: ${payload.reason}`,
        '',
        payload.message,
      ].join('\n'),
    });

    // Confirm receipt to the visitor
    const visitorEmail = resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: payload.email,
      subject: `Thanks for reaching out!`,
      text: `Hi ${payload.name},\n\nThanks for reaching out! I'll get back to you soon.\n\nNikhil`,
    });

    // Resend SDK returns { data, error } instead of throwing — check both results
    const [ownerResult, visitorResult] = await Promise.all([ownerEmail, visitorEmail]);

    if (ownerResult.error) {
      return { success: false, error: 'Failed to send message. Please try again.' };
    }

    if (visitorResult.error) {
      // Owner was notified — don't surface visitor confirmation failure to the user
      console.error('Resend visitor confirmation error:', visitorResult.error);
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Failed to send message. Please try again.' };
  }
}
