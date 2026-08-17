import { z } from "zod";

export const timelineTypeSchema = z.enum([
  "experience",
  "education",
]);

export const timelineFormSchema = z
  .object({
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().min(1, "Location is required"),

    startDate: z.string().min(1, "Start Date is required"),

    endDate: z.string().default(""),

    isPresent: z.boolean().default(false),

    description: z.string().min(1, "Description is required"),

    type: timelineTypeSchema,

    publicAccess: z.boolean().default(true),

    tags: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.isPresent) {
        return data.endDate === "present";
      }

      return (
        data.endDate.trim() !== "" &&
        data.endDate !== "present"
      );
    },
    {
      path: ["endDate"],
      message: 'End date is required, or select "Present".',
    },
  );

// What RHF receives as input
export type TimelineFormInput =
  z.input<typeof timelineFormSchema>;

// What comes OUT of Zod after parsing/defaults
export type TimelineFormValues =
  z.output<typeof timelineFormSchema>;