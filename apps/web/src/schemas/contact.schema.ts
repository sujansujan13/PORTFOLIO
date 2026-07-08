import { z } from "zod";

export const contactSchema = z.object({
  // Use z.string({ error: "..." }) instead of min() for initial checks if preferred,
  // or pass an object with the error key to min()
  name: z
    .string()
    .min(2, { error: "Name record requires at least two characters" }),

  // ✅ Zod v4 Top-level email function with unified error parameter
  email: z.email({
    error: "Please provide a valid communication email address",
  }),

  subject: z
    .string()
    .min(1, { error: "Please select an architectural target context" }),
  message: z.string().min(10, {
    error: "Message block requires at least 10 characters descriptive depth.",
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

// export type contactFormValue = z.infer<typeof contactSchema>;
// infer is a utility provided by Zod that automatically extracts the TypeScript type from a Zod schema.
