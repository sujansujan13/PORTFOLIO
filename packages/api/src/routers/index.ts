import { protectedProcedure, publicProcedure, router } from "../index";
import { blogRouter } from "./blog.router";
import { categoryRouter } from "./category.router";
import { contactRouter } from "./contact.router";
import { dashboardRouter } from "./dashboard.router";
import { profileRouter } from "./profile.router";
import { projectRouter } from "./projects.router";
import { timelineRouter } from "./timeline.router";
import { userRouter } from "./user.router";

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

  user: userRouter,
  projects: projectRouter,
  blogs: blogRouter,
  timeline: timelineRouter,
  dashboard: dashboardRouter,
  contact: contactRouter,
  profile: profileRouter,
  category: categoryRouter,
});
export type AppRouter = typeof appRouter;
