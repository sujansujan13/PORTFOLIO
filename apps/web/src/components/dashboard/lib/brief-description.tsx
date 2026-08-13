"use client";

import TextField from "../forms/text-field";
import TextareaField from "../forms/textarea-field";
import ReadonlySlugField from "../forms/readonly-slug-field";
import { slugify } from "@/utils/slugify";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { ProjectFormValues } from "@/schemas/project";

interface ProjectBasicSectionProps {
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
  setValue: UseFormSetValue<ProjectFormValues>;
}

export default function BriefDescription({
  register,
  errors,
  setValue,
}: ProjectBasicSectionProps) {
  const titleRegistration = register("title");

  return (
    <>
      <TextField
        label="Project Title"
        placeholder="e.g. Portfolio v2.0"
        registration={{
          ...titleRegistration,
          onChange: async (event) => {
            await titleRegistration.onChange(event);

            const title = event.target.value;
            const slug = slugify(title);

            setValue("customSlug", slug, {
              shouldValidate: slug.length > 0,
              shouldDirty: slug.length > 0,
              shouldTouch: slug.length > 0,
            });
          },
        }}
        error={errors.title?.message}
      />

      <ReadonlySlugField
        prefix="/projects/"
        registration={register("customSlug")}
        error={errors.customSlug?.message}
      />

      <TextField
        label="Project Subtitle"
        placeholder="e.g. Full-stack portfolio CMS"
        registration={register("subtitle")}
        error={errors.subtitle?.message}
      />

      <TextareaField
        label="Short Description"
        registration={register("description")}
        placeholder="Short summary for project cards and SEO preview..."
        error={errors.description?.message}
      />
    </>
  );
}
