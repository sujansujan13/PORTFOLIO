import { z } from "zod";
import mongoose from "mongoose";

export const updateStatusSchema = z.object({
  id: z.string().refine(mongoose.isValidObjectId, "Invalid ID"),
  status: z.enum(["read", "unread", "archived", "spam"]),
});

export type UpdateStatus = z.infer<typeof updateStatusSchema>;
