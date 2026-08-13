// zod is by default required
// we have to .optional() to make it optional
// model is by default optional, omit required or use required:false to make it optional
// .nullable()

import { z } from "zod";
import { tiptapNodeSchema } from "./tiptap.schema";

export const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ID");

export const projectFeatureIconSchema = z.enum([
  "gauge",
  "blocks",
  "compass",
  "layers",
]);

// Purpose: Validates MongoDB document ids before using them in queries.
export const projectIdSchema = z.object({
  id: mongoIdSchema,
});

const optionurl = z.url().optional().or(z.literal(""));
export const imageUrl = z
  .url()
  .or(z.string().regex(/^\/.+/, "Image must be a URL or local public path"))
  .or(z.literal(""))
  .optional();

export const projectMetricsSchema = z.object({
  value: z.string().min(1, "Metric Value is required"),
  label: z.string().min(1, "Metric label is required"),
});

export const projectFeatureSchema = z.object({
  title: z.string().min(1, "Feature title is required"),
  description: z.string().min(1, "Feature description is required"),
  icon: projectFeatureIconSchema.default("gauge"),
});

export const projectMetricSchema = z.object({
  value: z.string().min(1, "Metric value is required"),
  label: z.string().min(1, "Metric label is required"),
});

export const deleteProjectSchema = z.object({
  id: mongoIdSchema,
});

export const deleteManyProjectsSchema = z.object({
  ids: z.array(mongoIdSchema).min(1),
});

// Purpose: validates the full payload needed when creating or editing a project.
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
  body: tiptapNodeSchema,
  caseStudyPdfUrl: z.string().optional(),
  role: z.string(),
  timeline: z.string(),
  toolsUsed: z.array(z.string()).default([]),
  features: z.array(projectFeatureSchema).default([]),
  metrics: z.array(projectMetricSchema).default([]),
  heroImageUrl: imageUrl,
  thumbImageUrl: imageUrl,
  publicAccess: z.boolean().default(true),
  featured: z.boolean().default(false),
  techStack: z
    .array(z.string().min(1, "Technology cannot be empty"))
    .min(1, "Add at least one technology"),
  category: z.string().trim().min(1, "Choose at least one category"),
  githubUrl: optionurl,
  liveUrl: optionurl,
  seoTitle: z.string().min(5, "SEO title must be at least 5 characters"),
  seoDescription: z
    .string()
    .min(10, "SEO description must be at lest 10 characters"),
});

// Purpose: shared public fields that both card and detail responses expose.
const publicProjectBaseSchema = projectInputSchema
  .pick({
    title: true,
    subtitle: true,
    description: true,
    customSlug: true,
    category: true,
    heroImageUrl: true,
    thumbImageUrl: true,
    featured: true,
    techStack: true,
    githubUrl: true,
    liveUrl: true,
  })
  .extend({
    id: z.string().optional(),
    _id: z.string().optional(),
  });

// Purpose: lightweight payload for project cards and grid/list views.
export const publicProjectCardSchema = publicProjectBaseSchema;

// Purpose: full public payload for the project detail page.
export const publicProjectDetailSchema = publicProjectBaseSchema.extend({
  body: projectInputSchema.shape.body,
  metrics: projectInputSchema.shape.metrics,
  features: projectInputSchema.shape.features,
  role: projectInputSchema.shape.role,
  timeline: projectInputSchema.shape.timeline,
  toolsUsed: projectInputSchema.shape.toolsUsed,
  caseStudyPdfUrl: projectInputSchema.shape.caseStudyPdfUrl,
  relatedProject: z
    .object({
      title: z.string(),
      category: z.string(),
      slug: z.string(),
      image: z.string(),
    })
    .nullable()
    .optional(),
});

export const dashboardProjectRowSchema = projectInputSchema
  .pick({
    title: true,
    subtitle: true,
    customSlug: true,
    publicAccess: true,
    featured: true,
    category: true,
    // techStack is used in searching field
    techStack: true,
  })
  .extend({
    id: z.string(),
    imageUrl: z.string().optional(),
  });

export const getDashboardProjectsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

export const dashboardProjectResponseSchema = z.object({
  projects: z.array(dashboardProjectRowSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
  }),
});

export type DashboardRow = z.infer<typeof dashboardProjectRowSchema>;

export type DashboardResponse = z.infer<typeof dashboardProjectResponseSchema>;

export const projectUpdateSchema = projectInputSchema.partial();

// don't use export const, instead use export type
export type projectInput = z.infer<typeof projectInputSchema>;

export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export type PublicProjectCard = z.infer<typeof publicProjectCardSchema>;

export type PublicProjectDetail = z.infer<typeof publicProjectDetailSchema>;

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
