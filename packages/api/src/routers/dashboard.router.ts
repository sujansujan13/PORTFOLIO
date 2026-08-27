import { protectedProcedure, router } from "..";
import { getDashboardStats } from "../services/dashboard.service";

export const dashboardRouter = router({
  stats: protectedProcedure.query(async ({ctx}) => {
    return await getDashboardStats(ctx.session?.user.id as string);
  }),
});
