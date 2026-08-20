import { protectedProcedure, publicProcedure, router } from "../index";
import { blogRouter } from "./blog.router";
import { contactRouter } from "./contact.router";
import { dashboardRouter } from "./dashboard.router";
import { projectRouter } from "./projects.router";
import { timelineRouter } from "./timeline.router";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),

  projects: projectRouter,
  blogs: blogRouter,
  timeline: timelineRouter,
  dashboard: dashboardRouter,
  contact: contactRouter,
});
export type AppRouter = typeof appRouter;
