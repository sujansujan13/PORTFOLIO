import { z } from "zod";
import { tiptapNodeSchema } from "../tiptap.schema";

export const dashboardBlogDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  body: tiptapNodeSchema,
  featuredImage: z.string(),
  publicAccess: z.boolean(),
  category: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  publishedAt: z.coerce.date(),
  author: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
  }),
});

export type DashboardBlogDetail = z.infer<typeof dashboardBlogDetailSchema>;
