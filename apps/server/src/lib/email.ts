// src/lib/email.ts
import { resend } from "./resend";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export const sendEmail = async (
  params: SendEmailParams,
  retries = 3,
): Promise<string> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
    });

    if (!error && data) {
      return data.id;
    }

    console.error(`Resend attempt ${attempt + 1} failed:`, error);

    // Don't retry on validation errors (4xx-style) — only on transient issues
    if (error?.name === "validation_error" || attempt === retries) {
      throw new Error(
        `Email send failed: ${error?.message ?? "unknown error"}`,
      );
    }

    // simple backoff
    await new Promise((res) => setTimeout(res, 500 * (attempt + 1)));
  }

  throw new Error("Email send failed after retries");
};
