"use client";

import { Blocks, Compass, Gauge, Layers, Plus, Trash2 } from "lucide-react";
import { useFieldArray } from "react-hook-form";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import type { ProjectFormValues } from "@/schemas/project";

const featureIcons = [
  {
    value: "gauge",
    label: "Gauge",
    icon: Gauge,
  },
  {
    value: "blocks",
    label: "Blocks",
    icon: Blocks,
  },
  {
    value: "compass",
    label: "Compass",
    icon: Compass,
  },
  {
    value: "layers",
    label: "Layers",
    icon: Layers,
  },
] as const;

interface FeaturesFieldArrayProps {
  control: Control<ProjectFormValues>;
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
}

export function FeaturesFieldArray({
  control,
  register,
  errors,
}: FeaturesFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  return (
    <div className="bg-card border border-border p-5 rounded-md text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Key Features
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1">
            Add reusable feature cards for the project detail page.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              title: "",
              description: "",
              icon: "gauge",
            })
          }
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
            className="rounded-md border border-border bg-background/30 p-3 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
              <input
                {...register(`features.${index}.title`)}
                placeholder="Performance Driven"
                className="w-full bg-input/40 border border-border p-2 text-xs rounded-sm focus:outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:text-destructive hover:bg-background/60"
                title="Remove feature"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {errors.features?.[index]?.title && (
              <span className="text-destructive text-[10px] block">
                {errors.features[index]?.title?.message}
              </span>
            )}

            <textarea
              {...register(`features.${index}.description`)}
              placeholder="Zero-layout shift and optimized bundle sizes..."
              className="w-full min-h-20 bg-input/40 border border-border p-2 text-xs rounded-sm focus:outline-none focus:border-primary"
            />

            {errors.features?.[index]?.description && (
              <span className="text-destructive text-[10px] block">
                {errors.features[index]?.description?.message}
              </span>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {featureIcons.map((item) => {
                const Icon = item.icon;

                return (
                  <label
                    key={item.value}
                    className="flex items-center gap-2 rounded-md border border-border bg-input/20 px-2 py-2 text-xs cursor-pointer hover:bg-background/60"
                  >
                    <input
                      type="radio"
                      value={item.value}
                      {...register(`features.${index}.icon`)}
                      className="accent-primary"
                    />

                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>

            {errors.features?.[index]?.icon && (
              <span className="text-destructive text-[10px] block">
                {errors.features[index]?.icon?.message}
              </span>
            )}
          </div>
        ))}
      </div>

      {errors.features && typeof errors.features.message === "string" && (
        <span className="text-destructive text-xs block">
          {errors.features.message}
        </span>
      )}
    </div>
  );
}
