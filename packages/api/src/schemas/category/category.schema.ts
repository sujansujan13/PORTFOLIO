import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens",
    ),
  type: z.enum(["blog", "project"]),
  color: z.string().default("blue"),
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({
    id: z.string().min(1),
  })
  .refine(({ id, ...fields }) => Object.keys(fields).length > 0, {
    message: "At least one field must be provided for update",
  });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
