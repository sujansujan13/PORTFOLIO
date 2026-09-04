import { z } from "zod";

export const getCategoriesInputSchema = z.object({
  type: z.enum(["blog", "project"]).optional(),
});

export type GetCategoriesInputType = z.input<typeof getCategoriesInputSchema>;
