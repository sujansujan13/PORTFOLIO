import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
  Preview,
} from "@react-email/components";
import { Resend } from "resend";
import { env } from "@my-portfolio/env/server";
import type { ContactInputValues } from "../../schemas/contact/contact-input.schema";


interface ContactNotificationEmailProps {
  name: string;
  email: string;
  subjectLabel: string;
  message: string;
}

export function ContactNotificationEmail({
  name,
  email,
  subjectLabel,
  message,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New portfolio message: {subjectLabel}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
        <Container>
          <Heading as="h2">New portfolio contact message</Heading>

          <Section>
            <Text>
              <strong>Name:</strong> {name}
            </Text>
            <Text>
              <strong>Email:</strong> {email}
            </Text>
            <Text>
              <strong>Subject:</strong> {subjectLabel}
            </Text>
          </Section>

          <Hr />

          <Section>
            <Text>
              <strong>Message:</strong>
            </Text>
            {message.split("\n").map((line, i) => (
              <Text key={i} style={{ margin: "0 0 4px" }}>
                {line}
              </Text>
            ))}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ContactNotificationEmail;

export async function sendContactNotification(data: ContactInputValues) {
  const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "[Resend Warning] RESEND_API_KEY is missing. Skipping email delivery.",
    );
    return { id: "mock-email-id" };
  }

  const resend = new Resend(apiKey);
  const recipient =
    process.env.CONTACT_EMAIL_TO ||
    process.env.ADMIN_EMAIL ||
    "pandeysujan923@gmail.com";
  const fromEmail =
    env.RESEND_FROM_EMAIL ||
    process.env.CONTACT_EMAIL_FROM ||
    process.env.RESEND_FROM_EMAIL ||
    "Portfolio Contact <onboarding@resend.dev>";

  console.log(`[Resend] Attempting to send email notification to: ${recipient}...`);

  const { data: resendData, error } = await resend.emails.send({
    from: fromEmail,
    to: recipient,
    subject: `New Contact Message: ${data.subject}`,
    react: (
      <ContactNotificationEmail
        name={data.name}
        email={data.email}
        subjectLabel={data.subject}
        message={data.message}
      />
    ),
  });

  if (error) {
    console.error("[Resend Delivery Error]:", error);
    throw new Error(
      `Failed to send contact email notification: ${error.message}`,
    );
  }

  console.log("[Resend Delivery Success]:", resendData);
  return resendData;
}
