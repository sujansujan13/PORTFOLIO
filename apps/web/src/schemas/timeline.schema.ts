import { z } from "zod";

export const timelineTypeSchema = z.enum(["experience", "education"]);
export const timelineVisibilitySchema = z.enum(["public", "private"]);

export const timelineItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(2, "Role or Degree title is required"),
  company: z.string().min(2, "Company or Institution name is required"),
  location: z.string().min(2, "Location is required"),
  period: z.string().min(2, "Time period is required"),
  type: timelineTypeSchema,
  isPublic: z.boolean().default(true),
  description: z.string().optional(),
});

export const getTimelineQuerySchema = z.object({
  search: z.string().optional(),
  type: timelineTypeSchema.optional(),
  isPublic: z.boolean().optional(),
});

export type TimelineItem = z.infer<typeof timelineItemSchema>;
export type TimelineType = z.infer<typeof timelineTypeSchema>;
export type GetTimelineQuery = z.infer<typeof getTimelineQuerySchema>;
