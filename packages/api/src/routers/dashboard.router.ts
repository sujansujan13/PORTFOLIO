import { publicProcedure, router } from "..";
import { getDashboardStats } from "../services/dashboard.service";

export const dashboardRouter = router({
  stats: publicProcedure.query(async () => {
    return await getDashboardStats();
  }),
});
