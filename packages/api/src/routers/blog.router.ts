import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "..";
import {
  BlogInputSchema,
  getBlogBySlugSchema,
  getDashboardBlogInput,
  getPublicBlogsSchema,
  UpdateBlogSchema,
} from "../schemas/Blogs/blog.schema";
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
      const blog = await getBlogBySlug(input.slug);

      if (!blog) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog not found",
        });
      }

      return blog;
    }),

  getDashboardBlogs: protectedProcedure
    .input(getDashboardBlogInput)
    .query(async ({ input }) => getDashboardBlogs(input)),

  createBlog: protectedProcedure
    .input(BlogInputSchema)
    .mutation(({ input }) => createBlog(input)),

  getDashboardBlogById: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      return getDashboardBlogById(input.id);
    }),

  updateBlog: protectedProcedure
    .input(
      UpdateBlogSchema.extend({
        id: mongoIdSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const blog = await updateBlog(id, data);

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
    .mutation(async ({ input }) => {
      const result = await deleteBlog(input.id);

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
    .mutation(({ input }) => deleteMultipleBlogs(input.ids)),
});
