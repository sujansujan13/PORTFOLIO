"use client";

import React from "react";
import { Briefcase, GraduationCap } from "lucide-react";
import { useWatch, type UseFormReturn, type FieldErrors } from "react-hook-form";
import type {
  TimelineFormInput,
  TimelineFormValues,
} from "./../../../../schemas/timeline-form.schema";
import TagInputField from "./../../forms/tag-input-field"; // Your existing component

interface MetadataSectionProps {
  form: UseFormReturn<TimelineFormInput>;
  errors: FieldErrors<TimelineFormInput>;
}

export function MetadataSection({ form, errors }: MetadataSectionProps) {
  const { register, watch, setValue } = form;

  const currentType = useWatch({
    control: form.control,
    name: "type",
  });
  const tags = useWatch({ control: form.control, name: "tags" }) || [];

  const handleAddTag = (newTag: string) => {
    if (!tags.includes(newTag)) {
      setValue("tags", [...tags, newTag], { shouldValidate: true });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tagToRemove),
      { shouldValidate: true },
    );
  };

  return (
    <section className="bg-card border border-border/80 rounded-lg p-4 sm:p-5 space-y-5 shadow-sm transition-colors hover:border-border">
      <h2 className="text-sm sm:text-base font-bold text-foreground border-b border-border/60 pb-3">
        Metadata
      </h2>

      <div className="space-y-4">
        {/* Entry Type Segmented Control */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Entry Type
          </label>
          <div className="flex items-center  bg-input/30 border border-border rounded-md gap-1">
            <button
              type="button"
              onClick={() => setValue("type", "experience")}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded transition-all cursor-pointer ${
                currentType === "experience"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Experience</span>
            </button>

            {/* Vertical Divider Line */}
            <div className="w-px h-5 bg-white/60 shrink-0" />

            <button
              type="button"
              onClick={() => setValue("type", "education")}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded transition-all cursor-pointer ${
                currentType === "education"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education</span>
            </button>
          </div>
        </div>

        {/* Tech Stack / Skills Tag Input */}
        <TagInputField
          title="Tech Stack / Skills"
          values={tags}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
          placeholder="Add tag and press Enter..."
          error={errors.tags?.message}
        />
      </div>
    </section>
  );
}
