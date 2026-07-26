import { z } from "zod";

const optionurl = z.url().optional().or(z.literal(""));

export const projectInputSchema = z.object({
  title: z.string().trim().min(3, "Project title must be 3 characters"),
  subtitle: z.string().trim().min(5, "Project title must be 5 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  customSlug: z
    .string()
    .trim()
    .min(3, "URL slug must be at least 3 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  body: z
    .string()
    .min(10, "Project Description must be at least 10 characters"),
  heroImageUrl: z.url("Hero image must be a valid url"),
  thumbImageUrl: z.url("Thumb image must be a valid url"),
  publicAccess: z.boolean().default(true),
  techStack: z.array(z.string().min(1, "Add at least one technology")),
  category: z.string().trim().min(1, "Choose at least one category"),
  githubUrl: optionurl,
  liveUrl: optionurl,
  seotitle: z.string().min(5, "SEO title must be at least 5 characters"),
  seodescription: z
    .string()
    .min(10, "SEO description must be at lest 10 characters"),
});

export const projectUpdateSchema = projectInputSchema.partial();

// don't use export const, instead use export type
export type projectInput = z.infer<typeof projectInputSchema>;

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

// export const projectUpdateSchema = projectInputSchema.partial();
//
// .partial()
// Creates a new schema where all fields become optional.
// Used for update (PATCH) operations, where only the changed fields need to be sent.

// export type ProjectInput = z.infer<typeof projectInputSchema>;
//
// z.infer()
// Automatically generates a TypeScript type from the Zod schema.
// Prevents writing the same structure twice.
