import { z } from "zod";
export const getContactMessagesSchema = z.object({
  status: z.enum(["all", "read", "unread", "archived"]).default("all"),
  emailNotificationStatus: z
    .enum(["all", "sent", "pending", "failed"])
    .default("all"),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  search: z.string().trim().optional(),
  subject: z.enum(["all", "collaboration", "internship", "general"]),
});

export type GetContactMessagesInput = z.infer<typeof getContactMessagesSchema>;
