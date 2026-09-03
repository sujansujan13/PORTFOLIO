import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "..";
import {
  BlogInputSchema,
  getBlogBySlugSchema,
  getDashboardBlogInput,
  getPublicBlogsSchema,
  UpdateBlogSchema,
} from "../schemas/blogs/blog.schema";

import {
  createBlog,
  deleteBlog,
  deleteMultipleBlogs,
  getBlogBySlug,
  getDashboardBlogById,
  getDashboardBlogs,
  getPublicBlogs,
  updateBlog,
} from "../services/blog.service";
import { mongoIdSchema } from "../schemas/project.schema";

export const blogRouter = router({
  getPublicBlogs: publicProcedure
    .input(getPublicBlogsSchema)
    .query(({ input }) => getPublicBlogs(input)),

  getBlogBySlug: publicProcedure
    .input(getBlogBySlugSchema)
    .query(async ({ input }) => {
      const blog = await getBlogBySlug(input.slug, input?.userId as string);

      if (!blog) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog not found",
        });
      }

      return blog;
    }),

    // [MULTI-TENANT CHANGE]: Pass ctx.session.user.id to filter dashboard blogs by the logged-in user
  getDashboardBlogs: protectedProcedure
    .input(getDashboardBlogInput)
    .query(async ({ ctx,input }) => getDashboardBlogs(ctx.session.user.id,input)),

  createBlog: protectedProcedure
    .input(BlogInputSchema)
    .mutation(({ ctx,input }) => createBlog(ctx.session.user.id,input)),

  getDashboardBlogById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ctx, input }) => {
      return getDashboardBlogById(ctx.session.user.id,input.id);
    }),

  updateBlog: protectedProcedure
    .input(
      UpdateBlogSchema.extend({
        id: mongoIdSchema,
      }),
    )
    .mutation(async ({ctx, input }) => {
      const { id, ...data } = input;
      const blog = await updateBlog(ctx.session.user.id,id, data);

      if (!blog) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog Not Found",
        });
      }

      return blog;
    }),

  deleteBlog: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ctx, input }) => {
      const result = await deleteBlog(ctx.session.user.id,input.id);

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog Not Found",
        });
      }

      return result;
    }),

  deleteMultiplBlogs: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .mutation(({ctx, input }) => deleteMultipleBlogs(ctx.session.user.id,input.ids)),
});
