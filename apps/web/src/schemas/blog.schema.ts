import { imageUrl } from "@my-portfolio/api/schemas/project.schema";
import { tiptapNodeSchema } from "@my-portfolio/api/schemas/tiptap.schema";
import { z } from "zod";

export const blogFormSchema = z.object({
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
    .min(10, "SEO description must be at least 10 characters"),

  publishedAt: z.coerce.date(),

  author: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
  }),
});

export type BlogFormInput = z.input<typeof blogFormSchema>;
export type BlogFormValues = z.output<typeof blogFormSchema>;
