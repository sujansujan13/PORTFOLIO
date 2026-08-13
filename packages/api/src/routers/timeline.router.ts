import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "..";
import { getPublicTimelineSchema } from "../schemas/timeline.schema";
import { createTimelineSchema } from "../schemas/Timeline/createTimeline.schema";
import {
  getDashboardTimelineInputSchema,
  updateTimelineRouterInputSchema,
} from "../schemas/Timeline/timelineRouterInput.schema";
import {
  createTimeline,
  deleteTimeline,
  getDashboardTimeline,
  getDashboardTimelineById,
  getPublicTimeline,
  updateTimeline,
} from "../services/timeline.service";
export const timelineRouter = router({
  getPublicTimeline: publicProcedure
    .input(getPublicTimelineSchema)
    .query(({ input }) => {
      return getPublicTimeline(input);
    }),

  getDashboardTimeline: protectedProcedure
    .input(getDashboardTimelineInputSchema)
    .query(async ({ input }) => getDashboardTimeline(input)),

  createTimeline: protectedProcedure
    .input(createTimelineSchema)
    .mutation(({ input }) => createTimeline(input)),

  getDashboardTimelineById: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "ID is required"),
      }),
    )
    .query(({ input }) => getDashboardTimelineById(input.id)),

  updateTimeline: protectedProcedure
    .input(updateTimelineRouterInputSchema)
    .mutation(({ input }) => updateTimeline(input.id, input.data)),

  deleteTimeline: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Id is required"),
      }),
    )
    .mutation(({ input }) => deleteTimeline(input.id)),
});
