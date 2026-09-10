"use client";

import React from "react";
import { FileText } from "lucide-react";
import {
  Controller,
  type UseFormReturn,
  type FieldErrors,
} from "react-hook-form";
import type { TimelineFormInput } from "./../../../../schemas/timeline-form.schema";
import { TiptapEditorSmall } from "../../utils/tiptap-editor-small";

interface DescriptionSectionProps {
  form: UseFormReturn<TimelineFormInput>;
  errors: FieldErrors<TimelineFormInput>;
  maxLength?: number;
}

export function DescriptionSection({
  form,
  errors,
  maxLength = 1000,
}: DescriptionSectionProps) {
  const { control } = form;

  return (
    <section className="group bg-card border border-border/80 rounded-lg p-4 sm:p-5 space-y-4 shadow-sm transition-all duration-200 hover:border-border">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <FileText className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground leading-none">
              Detailed Description & Achievements
            </h2>
            <p className="text-[11px] text-muted-foreground mt-1">
              Add key achievements and responsibilities using rich text formatting or bullet lists.
            </p>
          </div>
        </div>
      </div>

      {/* Tiptap Editor */}
      <div className="space-y-1.5">
        <Controller
          name="bullets"
          control={control}
          render={({ field }) => (
            <TiptapEditorSmall
              value={
                typeof field.value === "string" && field.value.trim() !== ""
                  ? field.value
                  : Array.isArray(field.value) && field.value.length > 0
                  ? `<ul>${(field.value as string[]).map((b) => `<li>${b}</li>`).join("")}</ul>`
                  : "<ul><li></li></ul>"
              }
              onChange={field.onChange}
              placeholder="• Built responsive dashboard UI using Next.js & Tailwind CSS&#10;• Integrated MongoDB aggregation pipelines..."
              minHeight="160px"
            />
          )}
        />
        {errors.bullets?.message && (
          <p className="text-xs text-destructive mt-1">
            {errors.bullets.message}
          </p>
        )}
      </div>
    </section>
  );
}
