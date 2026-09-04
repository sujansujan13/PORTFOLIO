import { z } from "zod";
import { protectedProcedure, router } from "..";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category/category.schema";
import { getCategoriesInputSchema } from "../schemas/category/getCategories-input.schema";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/category.service";

export const categoryRouter = router({
  getCategories: protectedProcedure
    .input(getCategoriesInputSchema)
    .query(({ input, ctx }) => getCategories(input, ctx.session?.user.id)),

  createCategory: protectedProcedure
    .input(createCategorySchema)
    .mutation(({ input, ctx }) => createCategory(input, ctx.session.user.id)),

  updateCategory: protectedProcedure
    .input(updateCategorySchema)
    .mutation(({ ctx, input }) => updateCategory(ctx.session.user.id, input)),

  deleteCategory: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Id is required"),
      }),
    )
    .mutation(({ input, ctx }) =>
      deleteCategory(input.id, ctx.session.user.id),
    ),
});
