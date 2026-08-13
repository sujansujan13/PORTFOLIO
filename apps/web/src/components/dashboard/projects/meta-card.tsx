"use client";

import { Settings } from "lucide-react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type MetaFormValues = FieldValues & {
  seoTitle: string;
  seoDescription: string;
};

interface MetaCardProps<T extends MetaFormValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export function MetaCard<T extends MetaFormValues>({
  register,
  errors,
}: MetaCardProps<T>) {
  const seoTitle = "seoTitle" as Path<T>;
  const seoDescription = "seoDescription" as Path<T>;

  return (
    <section className="bg-card border border-border p-6 rounded-md space-y-2">
      <div className="flex items-center gap-3 pb-4 border-b border-border/40">
        <div className="p-2 bg-indigo-500/10 text-[#7c3aed] border border-indigo-500/20 rounded-sm">
          <Settings className="w-5 h-5" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground">
            Advanced Settings
          </h2>

          <p className="text-[10px] text-muted-foreground">
            SEO optimization rules & permanent targets
          </p>
        </div>
      </div>

      {/* SEO Title */}
      <div className="flex flex-col gap-1.5 mb-5">
        <label className="text-xs font-semibold text-muted-foreground">
          SEO Meta Title
        </label>

        <input
          type="text"
          placeholder="Enter custom browser tab meta title..."
          {...register(seoTitle)}
          className="w-full dark:bg-[#0d233c]/40 text-foreground border border-border px-3 py-2.5 text-xs focus:outline-none focus:border-primary/50 font-sans rounded-md"
        />

        {errors.seoTitle && (
          <p className="text-xs text-destructive font-mono">
            {errors.seoTitle.message as string}
          </p>
        )}
      </div>

      {/* SEO Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          SEO Meta Description
        </label>

        <textarea
          rows={3}
          placeholder="Enter description snippet visible inside search listing index cards..."
          {...register(seoDescription)}
          className="w-full dark:bg-[#0d233c]/40 text-foreground border border-border p-3 text-xs rounded-md focus:outline-none focus:border-primary/50 resize-y font-sans"
        />

        {errors.seoDescription && (
          <p className="text-xs text-destructive font-mono">
            {errors.seoDescription.message as string}
          </p>
        )}
      </div>
    </section>
  );
}
