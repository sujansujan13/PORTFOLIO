import { z } from "zod";

export const timelineTypeSchema = z.enum(["experience", "education"]);

export const timelineItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(2, "Role or Degree title is required"),
  company: z.string().min(2, "Company or Institution name is required"),
  location: z.string().min(2, "Location is required"),

  startDate: z.string(),
  endDate: z.string().nullable(),

  isPresent: z.boolean(),

  description: z.string(),

  bullets: z.array(z.string()),
  tags: z.array(z.string()),

  type: timelineTypeSchema,
  order: z.number(),

  publicAccess: z.boolean(),
});
export const getTimelineQuerySchema = z.object({
  search: z.string().optional(),
  type: timelineTypeSchema.optional(),
  isPublic: z.boolean().optional(),
});

export type TimelineItem = z.infer<typeof timelineItemSchema>;
export type TimelineType = z.infer<typeof timelineTypeSchema>;
export type GetTimelineQuery = z.infer<typeof getTimelineQuerySchema>;
