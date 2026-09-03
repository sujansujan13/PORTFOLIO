import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "..";
import { getPublicTimelineSchema } from "../schemas/timeline.schema";
import { createTimelineSchema } from "../schemas/timeline/createTimeline.schema";
import {
  getDashboardTimelineInputSchema,
  updateTimelineRouterInputSchema,
} from "../schemas/timeline/timelineRouterInput.schema";

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
    .query(async ({ ctx, input }) =>
      getDashboardTimeline(ctx.session.user.id, input),
    ),

  createTimeline: protectedProcedure
    .input(createTimelineSchema)
    .mutation(({ ctx, input }) => createTimeline(ctx.session.user.id, input)),

  getDashboardTimelineById: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "ID is required"),
      }),
    )
    .query(({ ctx, input }) =>
      getDashboardTimelineById(ctx.session.user.id, input.id),
    ),

  updateTimeline: protectedProcedure
    .input(updateTimelineRouterInputSchema)
    .mutation(({ ctx, input }) =>
      updateTimeline(ctx.session.user.id, input.id, input.data),
    ),

  deleteTimeline: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Id is required"),
      }),
    )
    .mutation(({ ctx, input }) =>
      deleteTimeline(ctx.session.user.id, input.id),
    ),
});
