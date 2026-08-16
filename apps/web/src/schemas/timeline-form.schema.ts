import { z } from "zod";

export const timelineFormSchema = z
  .object({
    role: z.string().min(1),
    company: z.string().min(1),
    location: z.string().min(1),

    startDate: z.string().min(1),

    endDate: z.string().default(""),

    isPresent: z.boolean().default(false),

    description: z.string().min(1),

    type: z.enum(["experience", "education"]),

    publicAccess: z.boolean().default(true),

    tags: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.isPresent) {
        return data.endDate === "present";
      }

      return data.endDate.trim() !== "" && data.endDate !== "present";
    },
    {
      path: ["endDate"],
      message: 'End date is required, or select "Present".',
    },
  );

export type TimelineFormInput = z.input<typeof timelineFormSchema>;
export type TimelineFormValues = z.output<typeof timelineFormSchema>;
