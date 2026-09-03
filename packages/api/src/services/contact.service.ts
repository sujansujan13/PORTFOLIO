import {
  contactInputFormSchema,
  type ContactInputValues,
} from "./../schemas/contact/contact-input.schema";

import { Contact } from "@my-portfolio/db";

import { sendContactNotification } from "../lib/email/contact-notification";
import {
  getContactMessagesSchema,
  type GetContactMessagesInput,
} from "../schemas/contact/getContactMessage.schema";
import {
  getContactMessagesResponseSchema,
  type ContactMessageResponse,
} from "../schemas/contact/dashboardSchema-Response.schema";
import type { MessageDocument } from "@my-portfolio/db/models/contact.model";
import {
  toggleReadSchema,
  type ToggleRead,
} from "../schemas/contact/toggle-read.schema";
import mongoose from "mongoose";
import { TRPCError } from "@trpc/server";
import {
  updateStatusSchema,
  type UpdateStatus,
} from "../schemas/contact/update-status.schema";


interface CreateContactMessageOptions {
  ipHash?: string | null;
  userAgent?: string | null;
  source?: string;
}

export async function createContactMessage(
  recipientUserId:string,
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
    recipientUserId,

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
      { _id: contactMessage._id, recipientUserId },
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
      { _id: contactMessage._id, recipientUserId },
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

export async function getContactMessages(recipientUserId:string, input: GetContactMessagesInput) {
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

  const filter: Record<string, unknown> = {recipientUserId};

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

    case "spam":
      filter.status = "spam";
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

    const [total, read, unread, archived, spam, sent, pending, failed] =
      await Promise.all([
        Contact.countDocuments({recipientUserId}),

        Contact.countDocuments({
          status: "read",
          recipientUserId
        }),

        Contact.countDocuments({
          recipientUserId,
          status: "unread",
        }),

        Contact.countDocuments({
          recipientUserId,
          status: "archived",
        }),

        Contact.countDocuments({
          recipientUserId,
          status: "spam",
        }),

        Contact.countDocuments({
          recipientUserId,
          "emailNotifications.status": "sent",
        }),

        Contact.countDocuments({
          recipientUserId,
          "emailNotifications.status": "pending",
        }),

        Contact.countDocuments({
          recipientUserId,
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
        spam,
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

export async function updateContactMessageReadStatus(recipientUserId:string,input: ToggleRead) {
  const validatedInput = toggleReadSchema.parse(input);

  const { status, id } = validatedInput;

  if (!mongoose.isValidObjectId(id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Id",
    });
  }

  try {
    const updateMessage = await Contact.findOneAndUpdate(
      {_id:id, recipientUserId},
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateMessage) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Message Not Found",
      });
    }

    return serializeContactMessage(updateMessage);
  } catch (error) {
    console.error("Error while toggling message status:", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while toggling message status",
    });
  }
}

export async function archiveContactMessage(recipientUserId:string,id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Contact Id",
    });
  }

  try {
    const updateArchive = await Contact.findOneAndUpdate(
      {_id:id, recipientUserId},
      {
        $set: {
          status: "archived",
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateArchive) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Message Not Found",
      });
    }

    return serializeContactMessage(updateArchive);
  } catch (error) {
    console.error("Error while archiving message:", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while archiving message",
    });
  }
}

export async function markAllRead(recipientUserId:string) {
  try {
    const result = await Contact.updateMany(
      {
        recipientUserId,
        status: "unread",
      },
      {
        $set: {
          status: "read",
        },
      },
      {
        runValidators: true,
      },
    );
    return {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    console.error("Error making all unread messages read", error);
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while making all unread messages read",
    });
  }
}

export async function getSingleContactMessage(recipientUserId:string,id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Contact Id",
    }); 
  }

  try {
    const contactMessage = await Contact.findOne({_id:id, recipientUserId});

    if (!contactMessage) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Contact message with ID ${id} not found`,
      });
    }

    return serializeContactMessage(contactMessage);
  } catch (error) {
    console.error(error);
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error occurred while fetching contact message",
    });
  }
}

export async function deleteSingleContact(recipientUserId:string,id: string) {
  if (!mongoose.isValidObjectId(id)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid Id",
    });
  }

  try {
    const deletedContact = await Contact.findOneAndDelete({_id:id, recipientUserId});

    if (!deletedContact) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Contact message with ID:${id} doesn't exist`,
      });
    }

    return {
      deleted: true,
      id: deletedContact?._id.toString(),
    };
  } catch (error) {
    console.error("Error deleting single contact", error);

    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while deleting single contact message",
    });
  }
}

export async function updateStatus(recipientUserId:string,input: UpdateStatus) {
  const validatedInput = updateStatusSchema.parse(input);

  const { status, id } = validatedInput;

  try {
    const updateStatus = await Contact.findOneAndUpdate(
      {_id:id, recipientUserId},
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateStatus) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Message Not Found",
      });
    }

    return serializeContactMessage(updateStatus);
  } catch (error) {
    console.error("Error updating the message status", error);
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while updating the status",
    });
  }
}
