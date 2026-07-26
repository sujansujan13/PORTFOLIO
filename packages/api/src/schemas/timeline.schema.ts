import { z } from "zod";

export const timelineTypeSchema = z.enum(["experience", "education"]);

export const getPublicTimelineSchema = z
  .object({
    type: timelineTypeSchema.optional(),
    limit: z.number().int().min(1).max(50).default(50),
  })
  .optional();

export const publicTimelineItemSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  location: z.string(),
  period: z.string(),
  description: z.string(),
  bullets: z.array(z.string()),
  tags: z.array(z.string()),
  type: timelineTypeSchema,
  order: z.number(),
});

export const publicTimelineResponseSchema = z.object({
  experience: z.array(publicTimelineItemSchema),
  education: z.array(publicTimelineItemSchema),
});

export type TimelineType = z.infer<typeof timelineTypeSchema>;
export type PublicTimelineItem = z.infer<typeof publicTimelineItemSchema>;
export type PublicTimelineResponse = z.infer<
  typeof publicTimelineResponseSchema
>;
