"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import type { ProjectFormValues } from "@/schemas/project";

interface MetricsFieldArrayProps {
  control: Control<ProjectFormValues>;
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
}

export function MetricsFieldArray({
  control,
  register,
  errors,
}: MetricsFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "metrics",
  });

  return (
    <div className="bg-card border border-border p-5 rounded-md text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Project Metrics
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1">
            Example: 98 Lighthouse Score, 120+ Components
          </p>
        </div>

        <button
          type="button"
          onClick={() => append({ value: "", label: "" })}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-bold text-foreground hover:bg-background/60"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 rounded-md border border-border bg-background/30 p-3"
          >
            <div>
              <input
                {...register(`metrics.${index}.value`)}
                placeholder="98"
                className="w-full bg-input/40 border border-border p-2 text-xs rounded-sm focus:outline-none focus:border-primary"
              />
              {errors.metrics?.[index]?.value && (
                <span className="text-destructive text-[10px] mt-1 block">
                  {errors.metrics[index]?.value?.message}
                </span>
              )}
            </div>

            <div>
              <input
                {...register(`metrics.${index}.label`)}
                placeholder="Lighthouse Score"
                className="w-full bg-input/40 border border-border p-2 text-xs rounded-sm focus:outline-none focus:border-primary"
              />
              {errors.metrics?.[index]?.label && (
                <span className="text-destructive text-[10px] mt-1 block">
                  {errors.metrics[index]?.label?.message}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => remove(index)}
              className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:text-destructive hover:bg-background/60"
              title="Remove metric"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {errors.metrics && typeof errors.metrics.message === "string" && (
        <span className="text-destructive text-xs block">
          {errors.metrics.message}
        </span>
      )}
    </div>
  );
}
