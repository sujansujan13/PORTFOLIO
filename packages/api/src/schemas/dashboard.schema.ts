// object can be put inside object in zod schema
import { z } from "zod";

export const dashboardStatSchema = z.object({
  projects: z.object({
    total: z.number(),
    addedThisMonth: z.number(),
  }),
  experience: z.object({
    total: z.number(),
    lastUpdated: z.date().nullable(),
  }),
  blogs: z.object({
    total: z.number(),
    totalViews: z.number(),
  }),
  contacts: z.object({
    total: z.number().int().positive(),
  }),
});

export type DashboardStats = z.infer<typeof dashboardStatSchema>;
