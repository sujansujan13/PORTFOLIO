import { z } from "zod";

export const toggleReadSchema = z.object({
  id: z.string(),
  status: z.enum(["read", "unread"]),
});

export type ToggleRead = z.infer<typeof toggleReadSchema>;
