import * as z from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(3, "Project title must be at least 3 characters long"),
  subtitle: z
    .string()
    .min(5, "Platform subtitle must be at least 5 characters long"),
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
});

// Use z.input for form values instead of z.infer.
export type ProjectFormValues = z.input<typeof projectFormSchema>;
