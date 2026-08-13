import { tiptapNodeSchema } from "@my-portfolio/api/schemas/tiptap.schema";
import * as z from "zod";

export const projectMetricsSchema = z.object({
  value: z.string().min(1, "Metric Value is required"),
  label: z.string().min(1, "Metric label is required"),
});

export const projectFeatureIconSchema = z.enum([
  "gauge",
  "blocks",
  "compass",
  "layers",
]);

export const projectFeatureSchema = z.object({
  title: z.string().min(1, "Feature title is required"),
  description: z.string().min(1, "Feature description is required"),
  icon: projectFeatureIconSchema.default("gauge"),
});

export const projectFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Project title must be at least 3 characters long"),
  subtitle: z
    .string()
    .min(5, "Platform subtitle must be at least 5 characters long"),
  customSlug: z.string().min(2, "URL Slug must be at least 2 characters."),
  body: tiptapNodeSchema,
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  thumbImageUrl: z
    .url("Please provide a valid asset resource URL")
    .optional()
    .or(z.string().length(0)),

  heroImageUrl: z
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
  role: z.string().min(2, "Role is required"),
  timeline: z.string().trim().min(1, "Timeline is required"),
  toolsUsed: z.array(z.string()).min(1, "ToolsUsed is required"),
  featured: z.boolean().default(false),
  metrics: z.array(projectMetricsSchema).default([]),
  features: z.array(projectFeatureSchema).default([]),
});

export const projectCardSchema = projectFormSchema
  .pick({
    id: true,
    title: true,
    subtitle: true,
    customSlug: true,
    heroImageUrl: true,
    thumbImageUrl: true,
    techStack: true,
    category: true,
    githubUrl: true,
    liveUrl: true,
    description: true,
  })
  .extend({
    theme: z.string().default("blue"),
  });

// Type before Zod validates/transforms
export type ProjectFormValues = z.input<typeof projectFormSchema>;
// Type after Zod validates/transforms
export type ProjectCard = z.infer<typeof projectCardSchema>;
