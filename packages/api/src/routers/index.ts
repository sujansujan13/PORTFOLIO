import { protectedProcedure, publicProcedure, router } from "../index";
import { blogRouter } from "./blog.router";
import { projectRouter } from "./projects.router";

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
});
export type AppRouter = typeof appRouter;
