import { z } from "zod";
import { updateTimelineSchema } from "./updateTimeline.schema";
export const getDashboardTimelineInputSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["all", "education", "experience"]).default("all"),
});

export const updateTimelineRouterInputSchema = z.object({
  id: z.string().trim().min(1, "Id is required"),
  data: updateTimelineSchema,
});
