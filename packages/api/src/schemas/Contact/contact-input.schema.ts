import { z } from "zod";

export const contactSubjectSchema = z.enum([
  "collaboration",
  "internship",
  "general",
]);

export const contactInputFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .email("Please enter a valid email address")
    .trim()
    .max(254, "Email address is too long"),

  subject: contactSubjectSchema,

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message cannot exceed 5000 characters"),
});

export type ContactInputValues = z.infer<typeof contactInputFormSchema>;
