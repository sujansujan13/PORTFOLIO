import {
  contactInputFormSchema,
  type ContactInputValues,
} from "./../schemas/Contact/contact-input.schema";

import { Contact } from "@my-portfolio/db";

import { sendContactNotification } from "../lib/email/contact-notification";
import {
  getContactMessagesSchema,
  type GetContactMessagesInput,
} from "../schemas/Contact/getContactMessage.schema";
import {
  getContactMessagesResponseSchema,
  type ContactMessageResponse,
} from "../schemas/Contact/dashboardSchema-Response.schema";
import type { MessageDocument } from "@my-portfolio/db/models/contact.model";

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

export function serializeContactMessage(
  message: MessageDocument,
): ContactMessageResponse {
  return {
    id: String(message._id),

    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    status: message.status,

    emailNotifications: {
      status: message.emailNotifications?.status ?? "pending",
      sentAt: message.emailNotifications?.sentAt
        ? new Date(message.emailNotifications.sentAt).toISOString()
        : null,
      error: message.emailNotifications?.error ?? null,
      providerMessageId: message.emailNotifications?.providerMessageId ?? null,
    },

    metadata: {
      ipHash: message.metadata?.ipHash ?? null,
      userAgent: message.metadata?.userAgent ?? null,
      source: message.metadata?.source ?? null,
    },
    createdAt: new Date(message.createdAt).toISOString(),
    updatedAt: new Date(message.updatedAt).toISOString(),
  };
}

export async function getContactMessages(input: GetContactMessagesInput) {
  const validatedInput = getContactMessagesSchema.parse(input);

  const {
    status,
    emailNotificationStatus,
    search,
    page = 1,
    limit = 10,
    subject,
  } = validatedInput;

  // --------------------------------------------------
  // 1. Build filters for the message list
  // --------------------------------------------------

  const filter: Record<string, unknown> = {};

  switch (status) {
    case "all":
      filter.status = { $in: ["read", "unread"] };
      break;

    case "read":
      filter.status = "read";
      break;

    case "unread":
      filter.status = "unread";
      break;

    case "archived":
      filter.status = "archived";
      break;
  }

  if (subject !== "all") {
    filter.subject = subject;
  }

  if (emailNotificationStatus !== "all") {
    filter["emailNotifications.status"] = emailNotificationStatus;
  }

  if (search?.trim()) {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchRegex = new RegExp(escapedSearch, "i");

    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { subject: searchRegex },
      { message: searchRegex },
    ];
  }

  const skip = (page - 1) * limit;

  try {
    // --------------------------------------------------
    // 2. Fetch messages
    //
    // Priority:
    // unread → read → archived
    //
    // Within each status:
    // newest → oldest
    // --------------------------------------------------

    const contactMessages = await Contact.aggregate([
      {
        $match: filter,
      },

      {
        $addFields: {
          statusPriority: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$status", "unread"] },
                  then: 1,
                },
                {
                  case: { $eq: ["$status", "read"] },
                  then: 2,
                },
                {
                  case: { $eq: ["$status", "archived"] },
                  then: 3,
                },
              ],
              default: 4,
            },
          },
        },
      },

      {
        $sort: {
          statusPriority: 1,
          createdAt: -1,
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: limit,
      },

      // remove the temporary statusPriority field
      {
        $project: {
          statusPriority: 0,
        },
      },
    ]);
    // --------------------------------------------------
    // 3. Global dashboard counts
    //
    // These intentionally ignore search/filter/pagination.
    // --------------------------------------------------

    const [total, read, unread, archived, sent, pending, failed] =
      await Promise.all([
        Contact.countDocuments(),

        Contact.countDocuments({
          status: "read",
        }),

        Contact.countDocuments({
          status: "unread",
        }),

        Contact.countDocuments({
          status: "archived",
        }),

        Contact.countDocuments({
          "emailNotifications.status": "sent",
        }),

        Contact.countDocuments({
          "emailNotifications.status": "pending",
        }),

        Contact.countDocuments({
          "emailNotifications.status": "failed",
        }),
      ]);

    // --------------------------------------------------
    // 4. Total matching messages
    //
    // Used for pagination.
    // --------------------------------------------------

    const filteredTotal = await Contact.countDocuments(filter);

    const totalPages = Math.ceil(filteredTotal / limit);

    // --------------------------------------------------
    // 5. Response
    // --------------------------------------------------

    const serializedMessages: ContactMessageResponse[] = contactMessages.map(
      serializeContactMessage,
    );

    const response = {
      messages: serializedMessages,

      counts: {
        total,
        read,
        unread,
        archived,
        sent,
        pending,
        failed,
      },

      pagination: {
        page,
        limit,
        total: filteredTotal,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    return getContactMessagesResponseSchema.parse(response);
  } catch (error) {
    console.error("Error while fetching contact messages:", error);

    throw error;
  }
}
