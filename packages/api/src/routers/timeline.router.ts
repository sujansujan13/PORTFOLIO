import { publicProcedure, router } from "..";
import { getPublicTimelineSchema } from "../schemas/timeline.schema";
import { getPublicTimeline } from "../services/timeline.service";

export const timelineRouter = router({
  getPublicTimeline: publicProcedure
    .input(getPublicTimelineSchema)
    .query(({ input }) => {
      return getPublicTimeline(input);
    }),
});
