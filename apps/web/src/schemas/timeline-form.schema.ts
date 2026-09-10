import { z } from "zod";

export const timelineTypeSchema = z.enum(["experience", "education"]);

export const timelineFormSchema = z
  .object({
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().min(1, "Location is required"),

    startDate: z.string().min(1, "Start Date is required"),

    endDate: z.string().default(""),

    isPresent: z.boolean().default(false),

    description: z.string().min(1, "Description is required"),

    bullets: z
      .preprocess((val) => {
        if (typeof val === "string") {
          if (val.includes("<li")) {
            const matches = val.match(/<li[^>]*>(.*?)<\/li>/gi);
            if (matches) {
              return matches
                .map((m) => m.replace(/<[^>]+>/g, "").replace(/^[•\-\*]\s*/, "").trim())
                .filter((line) => line.length > 0);
            }
          }
          return val
            .replace(/<[^>]+>/g, "\n")
            .split("\n")
            .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
            .filter((line) => line.length > 0);
        }
        return val;
      }, z.array(z.string()))
      .default([]),

    type: timelineTypeSchema,

    publicAccess: z.boolean().default(true),

    tags: z.array(z.string()).default([]),
  })
  // Validate Present / End Date
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
  )
  // Validate End Date > Start Date
  .refine(
    (data) => {
      // Don't compare dates when the person is still present.
      if (data.isPresent) {
        return true;
      }

      // Let the first validation handle an empty end date.
      if (!data.startDate || !data.endDate) {
        return true;
      }

      return data.endDate > data.startDate;
    },
    {
      path: ["endDate"],
      message: "End date must be after the start date.",
    },
  );

export type TimelineFormInput = z.input<typeof timelineFormSchema>;

export type TimelineFormValues = z.output<typeof timelineFormSchema>;
