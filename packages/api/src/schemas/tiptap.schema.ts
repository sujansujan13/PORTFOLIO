import { z } from "zod";

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
          attrs: z.record(z.string(), z.unknown()).optional(),
        }),
      )
      .optional(),

    content: z.array(tiptapNodeSchema).optional(),
  }),
);

export type TiptapJson = z.infer<typeof tiptapNodeSchema>;
