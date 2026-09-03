import { z } from "zod";
import { timelineTypeSchema } from "../timeline.schema";

export const createTimelineSchema = z
  .object({
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().min(1, "Location is required"),

    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),

    isPresent: z.boolean(),

    description: z.string().min(1, "Description is required"),

    bullets: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),

    type: timelineTypeSchema,

    publicAccess: z.boolean().default(true),
  })
  .refine(
    (data) =>
      data.isPresent ? data.endDate === "present" : data.endDate !== "present",
    {
      path: ["endDate"],
      message: 'End date must be "present" when isPresent is true',
    },
  );

export type CreateTimelineInput = z.infer<typeof createTimelineSchema>;
