"use client";

import React from "react";
import { Briefcase } from "lucide-react";
import { useWatch, type UseFormReturn, type FieldErrors } from "react-hook-form";
import type { TimelineFormInput } from "./../../../../schemas/timeline-form.schema";
import TextField from "./../../forms/text-field"; // Your existing component

interface CoreDetailsSectionProps {
  form: UseFormReturn<TimelineFormInput>;
  errors: FieldErrors<TimelineFormInput>;
}

export function CoreDetailsSection({ form, errors }: CoreDetailsSectionProps) {
  const { register, setValue } = form;

  const isPresent = useWatch({
    control: form.control,
    name: "isPresent",
  });

  return (
    <section className="bg-card border border-border/80 rounded-lg p-4 sm:p-5 space-y-4 shadow-sm transition-colors hover:border-border">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <Briefcase className="w-4 h-4 text-primary shrink-0" />
        <h2 className="text-sm sm:text-base font-bold text-foreground">
          Core Details
        </h2>
      </div>

      <div className="space-y-4">
        {/* Role / Title */}
        <TextField
          label="Role / Title"
          placeholder="e.g. Senior Frontend Engineer"
          registration={register("role")}
          error={errors.role?.message}
        />

        {/* Company & Location (Responsive 2-column on tablet/laptop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Company / Institution"
            placeholder="e.g. Acme Corp"
            registration={register("company")}
            error={errors.company?.message}
          />
          <TextField
            label="Location"
            placeholder="Remote, CA or Kathmandu"
            registration={register("location")}
            error={errors.location?.message}
          />
        </div>

        {/* Start Date & End Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Start Date
            </label>
            <div className="flex items-center justify-between">
              <input
                type="month"
                {...register("startDate")}
                className={`w-full bg-input/40 border ${
                  errors.startDate
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                } p-2.5 text-xs font-sans focus:outline-none transition-colors rounded-sm text-foreground`}
              />
            </div>
            {errors.startDate && (
              <span className="text-destructive text-xs mt-1 block font-medium">
                {errors.startDate.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                End Date
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register("isPresent", {
                    onChange: (event) => {
                      if (event.target.checked) {
                        setValue("endDate", "present", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      } else {
                        setValue("endDate", "", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    },
                  })}
                  className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span className="font-semibold">Present</span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <input
                type="month"
                disabled={isPresent}
                {...register("endDate")}
                className={`w-full bg-input/40 border ${
                  !isPresent && errors.endDate
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                } p-2.5 text-xs font-sans focus:outline-none transition-colors rounded-sm text-foreground disabled:opacity-40 disabled:cursor-not-allowed`}
              />
            </div>
            {!isPresent && errors.endDate && (
              <span className="text-destructive text-xs mt-1 block font-medium">
                {errors.endDate.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
