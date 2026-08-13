import { z } from "zod";
import { imageUrl } from "../project.schema";
import { tiptapNodeSchema } from "../tiptap.schema";

export const getPublicBlogsSchema = z
  .object({
    category: z.string().optional(),
    limit: z.number().int().min(1).max(50).default(10),
  })
  .optional();

export const getBlogBySlugSchema = z.object({
  slug: z.string().min(2),
});

export const publicBlogCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  publishedAt: z.coerce.date(),
  featuredImage: z.string(),
  category: z.string(),
});

export const blogDetailSchema = publicBlogCardSchema.extend({
  author: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
  }),
  body: tiptapNodeSchema,
  toc: z.array(z.object({ id: z.string(), label: z.string() })),
  relatedPosts: z.array(
    z.object({
      title: z.string(),
      category: z.string(),
      slug: z.string(),
      image: z.string(),
    }),
  ),
});

export const blogDashboardSchema = publicBlogCardSchema
  .pick({
    id: true,
    featuredImage: true,
    title: true,
    category: true,
  })
  .extend({
    publicAccess: z.boolean().default(false),
    authorName: z.string(),
  });

export type BlogDashboard = z.infer<typeof blogDashboardSchema>;

export const BlogDashboardResponseSchema = z.object({
  blogs: z.array(blogDashboardSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type BlogDashboardResponse = z.infer<typeof BlogDashboardResponseSchema>;

export const getDashboardBlogInput = z.object({
  search: z.string().optional(),
  limit: z.number().default(10),
  page: z.number().default(1),
  category: z.string().optional(),
});

export const BlogInputSchema = z.object({
  title: z.string().trim().min(3, "Blog title must be 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  slug: z
    .string()
    .trim()
    .min(3, "URL slug must be at least 3 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  body: tiptapNodeSchema,
  featuredImage: imageUrl,
  publicAccess: z.boolean().default(false),
  category: z.string().trim().min(1, "Choose at least one category"),
  seoTitle: z.string().min(5, "SEO title must be at least 5 characters"),
  seoDescription: z
    .string()
    .min(10, "SEO description must be at lest 10 characters"),
  publishedAt: z.coerce.date(),
  author: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
  }),
});

export const UpdateBlogSchema = BlogInputSchema.partial();

export type UpdateBlog = z.infer<typeof UpdateBlogSchema>;

export type BlogInput = z.infer<typeof BlogInputSchema>;

export type DashboardBlogInput = z.infer<typeof getDashboardBlogInput>;

// export const blogDetailSchema =
export type PublicBlogCard = z.infer<typeof publicBlogCardSchema>;

// export type BlogBody = z.infer<typeof blogBodySegmentSchema>;

export type BlogDetail = z.infer<typeof blogDetailSchema>;

export type TiptapJson = z.infer<typeof tiptapNodeSchema>;
