import { z } from "zod";

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
  publishedAt: z.string(),
  featuredImage: z.string(),
  category: z.string(),
});

// export const blogBodySegmentSchema = z.object({
//   type: z.string(),
//   text: z.string().optional(),
//   code: z.string().optional(),
//   language: z.string().optional(),
//   url: z.string().optional(),
//   caption: z.string().optional(),
//   id: z.string().optional,
// });

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: {
    type: string;
    attrs?: Record<string, unknown>;
  }[];
  content?: TiptapNode[];
}

export const tiptapNodeSchema: z.ZodType<TiptapNode> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.string(), z.unknown()).optional(),
    text: z.string().optional(),
    marks: z
      .array(
        z.object({
          type: z.string(),
          attrs: z.record(z.string(), z.unknown().optional()),
        }),
      )
      .optional(),
    content: z.array(tiptapNodeSchema).optional(),
  }),
);

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

// export const blogDetailSchema =
export type PublicBlogCard = z.infer<typeof publicBlogCardSchema>;

// export type BlogBody = z.infer<typeof blogBodySegmentSchema>;

export type BlogDetail = z.infer<typeof blogDetailSchema>;

export type TiptapJson = z.infer<typeof tiptapNodeSchema>;
