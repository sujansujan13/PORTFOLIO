import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name record requires at least two characters"),
  email: z.email("Please provide a valid communication email address"),
  subject: z.string().min(1, "Please select an architectural target context"),
  message: z
    .string()
    .min(
      10,
      "Message block requires at least 10 characters descriptive depth.",
    ),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

// export type contactFormValue = z.infer<typeof contactSchema>;
// infer is a utility provided by Zod that automatically extracts the TypeScript type from a Zod schema.
