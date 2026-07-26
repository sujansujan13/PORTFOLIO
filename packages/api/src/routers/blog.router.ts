import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "..";
import {
  getBlogBySlugSchema,
  getPublicBlogsSchema,
} from "../schemas/blog.schema";
import { getBlogBySlug, getPublicBlogs } from "../services/blog.service";

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
});
