import * as z from "zod";

export const projectFormSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Project title must be at least 3 characters long"),
  subtitle: z
    .string()
    .min(5, "Platform subtitle must be at least 5 characters long"),
  customSlug: z.string().min(3, "URL Slug must be at least 3 characters."),
  body: z.string().min(10, "Project description must contain detailed content"),
  imageUrl: z
    .url("Please provide a valid asset resource URL")
    .optional()
    .or(z.string().length(0)),
  publicAccess: z.boolean().default(true),
  techStack: z
    .array(z.string())
    .min(1, "Select at least one framework or technology node"),
  category: z
    .string()
    .min(1, "Please choose a project classification category"),
  githubUrl: z
    .url("Please enter a valid GitHub Repository address")
    .optional()
    .or(z.string().length(0)),
  liveUrl: z
    .url("Please enter a valid active deployment address")
    .optional()
    .or(z.string().length(0)),
  seoTitle: z.string().min(5, "Please provide a valid seoTitle"),
  seoDescription: z.string().min(10, "Please provide a valid seoTitle"),
});

// Use z.input for form values instead of z.infer.
export type ProjectFormValues = z.input<typeof projectFormSchema>;

// import { z } from "zod";

// export const projectSchema = z.object({
//   title: z.string().min(2, "Project Title must be at least 2 characters."),
//   subtitle: z.string().min(5, "Subtitle must be at least 5 characters."),
//   description: z
//     .string()
//     .min(10, "Please provide a detailed project description."),
//   techStack: z
//     .array(z.string())
//     .min(1, "Select at least one technology stack."),
//   imageUrl: z.string().url("Please upload or provide a valid cover image URL."),
//   visibility: z.enum(["Public", "Draft"]),
//   environment: z.string().default("Production"),
//   customSlug: z.string().min(3, "URL Slug must be at least 3 characters."),
//   seoTitle: z
//     .string()
//     .max(60, "SEO Titles should stay under 60 characters.")
//     .optional(),
//   seoDescription: z
//     .string()
//     .max(160, "SEO Descriptions should stay under 160 characters.")
//     .optional(),
// });

// export type ProjectFormValues = z.infer<typeof projectSchema>;
