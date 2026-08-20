import {
  contactInputFormSchema,
  type ContactInputValues,
} from "./../schemas/Contact/contact-input.schema";

import { Contact } from "@my-portfolio/db";

import { sendContactNotification } from "../lib/email/contact-notification";

interface CreateContactMessageOptions {
  ipHash?: string | null;
  userAgent?: string | null;
  source?: string;
}

export async function createContactMessage(
  input: ContactInputValues,
  options: CreateContactMessageOptions = {},
) {
  /**
   * Always validate at the server boundary.
   *
   * Never trust validation performed only
   * by the frontend.
   */
  const validatedData = contactInputFormSchema.parse(input);

  /**
   * 1. Save the message first.
   *
   * MongoDB is the source of truth.
   */
  const contactMessage = await Contact.create({
    ...validatedData,

    status: "unread",

    emailNotifications: {
      status: "pending",
      sentAt: null,
      error: null,
      providerMessageId: null,
    },

    metadata: {
      ipHash: options.ipHash ?? null,
      userAgent: options.userAgent ?? null,
      source: options.source ?? "contact-form",
    },
  });

  /**
   * 2. Try to send the notification email.
   *
   * Email failure must NOT delete the
   * visitor's message from MongoDB.
   */
  try {
    const emailResult = await sendContactNotification(validatedData);

    /**
     * 3. Mark email as successfully sent.
     */
    await Contact.updateOne(
      { _id: contactMessage._id },
      {
        $set: {
          "emailNotifications.status": "sent",
          "emailNotifications.sentAt": new Date(),
          "emailNotifications.providerMessageId": emailResult?.id ?? null,
          "emailNotifications.error": null,
        },
      },
    );

    return {
      id: String(contactMessage._id),
      created: true,
      notification: "sent" as const,
    };
  } catch (error) {
    /**
     * 4. Email failed, but the message remains
     * safely stored in MongoDB.
     */
    const errorMessage =
      error instanceof Error ? error.message : "Unknown email delivery error";

    await Contact.updateOne(
      { _id: contactMessage._id },
      {
        $set: {
          "emailNotifications.status": "failed",
          "emailNotifications.error": errorMessage.slice(0, 1000),
        },
      },
    );

    /**
     * We intentionally don't throw here.
     *
     * The visitor successfully submitted their message.
     * The dashboard can show the failed email status
     * and allow you to retry later.
     */
    return {
      id: String(contactMessage._id),
      created: true,
      notification: "failed" as const,
    };
  }
}
