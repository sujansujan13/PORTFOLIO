"use client";

import TextField from "@/components/dashboard/forms/text-field";
import TextareaField from "@/components/dashboard/forms/textarea-field";
import ReadonlySlugField from "@/components/dashboard/forms/readonly-slug-field";

import { slugify } from "@/utils/slugify";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import type { BlogFormInput } from "@/schemas/blog.schema";

interface BlogDescriptionProps {
  register: UseFormRegister<BlogFormInput>;
  errors: FieldErrors<BlogFormInput>;
  setValue: UseFormSetValue<BlogFormInput>;
}

export default function BlogDescription({
  register,
  errors,
  setValue,
}: BlogDescriptionProps) {
  const titleRegistration = register("title");

  return (
    <div className="space-y-4">
      {/* Blog Title */}
      <TextField
        label="Blog Title"
        placeholder="e.g. Building a Modern Portfolio with Next.js"
        registration={{
          ...titleRegistration,
          onChange: async (event) => {
            // Keep React Hook Form's normal onChange behavior
            await titleRegistration.onChange(event);

            // Generate slug from title
            const title = event.target.value;
            const slug = slugify(title);

            setValue("slug", slug, {
              shouldValidate: slug.length > 0,
              shouldDirty: true,
              shouldTouch: slug.length > 0,
            });
          },
        }}
        error={errors.title?.message}
      />

      {/* Blog Slug */}
      <ReadonlySlugField
        prefix="/blogs/"
        registration={register("slug")}
        error={errors.slug?.message}
      />

      {/* Blog Description */}
      <TextareaField
        label="Short Description"
        rows={3}
        placeholder="Write a short summary for the blog card and SEO preview..."
        registration={register("description")}
        error={errors.description?.message}
      />

    </div>
  );
}
