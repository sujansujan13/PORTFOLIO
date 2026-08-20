import { z } from "zod";

// Define subject options based on the select dropdown
export const subjectOptions = [
  "collaboration",
  "internship",
  "general",
] as const;

export const contactInputFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.email("Please enter a valid email address").trim(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be atleast 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
  subject: z.enum(subjectOptions),
});

export type ContactInputValues = z.input<typeof contactInputFormSchema>;
