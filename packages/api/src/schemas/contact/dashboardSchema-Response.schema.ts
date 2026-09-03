import { z } from "zod";

export const contactMessageResponseSchema = z.object({
  id: z.string(),

  name: z.string(),
  email: z.email(),

  subject: z.enum(["collaboration", "internship", "general"]),

  message: z.string(),

  status: z.enum(["unread", "read", "archived", "spam"]),

  emailNotifications: z
    .object({
      status: z.enum(["pending", "sent", "failed"]),
      sentAt: z.string().nullable(),
      error: z.string().nullable().optional(),
      providerMessageId: z.string().nullable().optional(),
    })
    .optional(),

  metadata: z
    .object({
      ipHash: z.string().nullable().optional(),
      userAgent: z.string().nullable().optional(),
      source: z.string().nullable().optional(),
    })
    .optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export const getContactMessagesResponseSchema = z.object({
  messages: z.array(contactMessageResponseSchema),

  counts: z.object({
    total: z.number(),
    read: z.number(),
    unread: z.number(),
    archived: z.number(),
    spam: z.number(),
    sent: z.number(),
    pending: z.number(),
    failed: z.number(),
  }),

  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type ContactMessageResponse = z.infer<
  typeof contactMessageResponseSchema
>;
