import { z } from "zod";

export const timelineTypeSchema = z.enum(["experience", "education"]);

export const getPublicTimelineSchema = z
  .object({
    type: timelineTypeSchema.optional(),
    limit: z.number().int().min(1).max(50).default(50),
  })
  .optional();

export const publicTimelineItemSchema = z
  .object({
    id: z.string(),
    role: z.string(),
    company: z.string(),
    location: z.string(),

    startDate: z.string(),
    endDate: z.string(),

    isPresent: z.boolean().default(false),

    description: z.string(),
    bullets: z.array(z.string()),
    tags: z.array(z.string()),

    type: timelineTypeSchema,
    order: z.number(),
  })
  .refine(
    (data) =>
      data.isPresent ? data.endDate === "present" : data.endDate !== "present",
    {
      path: ["endDate"],
      message: 'End date must be "present" when isPresent is true',
    },
  )
  .refine(
    (data) => {
      if (data.isPresent) {
        return true;
      }
      if (!data.startDate || !data.endDate) {
        return true;
      }

      return data.endDate > data.startDate;
    },
    {
      path: ["endDate"],
      message: "End date must be after the start date.",
    },
  );

export const publicTimelineResponseSchema = z.object({
  experience: z.array(publicTimelineItemSchema),
  education: z.array(publicTimelineItemSchema),
});

export type TimelineType = z.infer<typeof timelineTypeSchema>;
export type PublicTimelineItem = z.infer<typeof publicTimelineItemSchema>;
export type PublicTimelineResponse = z.infer<
  typeof publicTimelineResponseSchema
>;
