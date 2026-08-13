import { z } from "zod";

export const updateTimelineSchema = z.object({
  role: z.string().trim().min(1),
  company: z.string().trim().min(1),
  location: z.string().trim().min(1),
  startDate: z.string().trim().min(1),
  endDate: z.string().nullable().optional(),
  isPresent: z.boolean().optional(),
  description: z.string().min(1),
  bullets: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  type: z.enum(["education", "experience"]),
  order: z.number().int().positive(),
  publicAccess: z.boolean().optional(),

  // Version received by the frontend.
  version: z.number().int().nonnegative(),
});

export type UpdateTimelineInput = z.infer<typeof updateTimelineSchema>;
