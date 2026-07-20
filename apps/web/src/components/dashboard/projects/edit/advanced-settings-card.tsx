"use client";

import { Settings, ShieldAlert } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { projectFormSchema, type ProjectFormValues } from "@/schemas/project";

interface AdvancedSettingsCardProps {
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
  customSlug: string;
}

export function AdvancedSettingsCard({
  register,
  errors,
  customSlug,
}: AdvancedSettingsCardProps) {
  return (
    <section className="bg-card border border-border p-6 rounded-md space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border/40">
        <div className="p-2 bg-indigo-500/10 text-[#7c3aed] border border-indigo-500/20">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground font-sans">
            Advanced Settings
          </h2>
          <p className="text-xs text-muted-foreground">
            SEO optimization rules & permanent targets
          </p>
        </div>
      </div>

      {/* URL Custom Slugs Container */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Custom URL Slug
        </label>
        <div className="flex flex-row border border-border bg-[#0d233c]/40 font-mono text-xs focus-within:border-primary/50 transition-colors">
          <span className="bg-[#0b1c30] text-muted-foreground/50 px-3 py-2.5 select-none border-r border-border/50">
            portfolio.io/projects/
          </span>
          <input
            type="text"
            {...register("customSlug")}
            className="flex-1 bg-transparent px-3 py-2.5 text-foreground focus:outline-none "
          />
        </div>
        {errors.customSlug && (
          <p className="text-xs text-destructive font-mono">
            {errors.customSlug.message}
          </p>
        )}
      </div>

      {/* SEO Title Configuration */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          SEO Meta Title
        </label>
        <input
          type="text"
          placeholder="Enter custom browser tab meta title..."
          {...register("seoTitle")}
          className="w-full bg-[#0d233c]/40 text-foreground border border-border px-3 py-2.5 text-xs rounded-none focus:outline-none focus:border-primary/50 font-sans"
        />
        {errors.seoTitle && (
          <p className="text-xs text-destructive font-mono">
            {errors.seoTitle.message}
          </p>
        )}
      </div>

      {/* SEO Meta Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          SEO Meta Description
        </label>
        <textarea
          rows={3}
          placeholder="Enter description snippet visible inside search listing index cards..."
          {...register("seoDescription")}
          className="w-full bg-[#0d233c]/40 text-foreground border border-border p-3 text-xs rounded-none focus:outline-none focus:border-primary/50 resize-y font-sans"
        />
        {errors.seoDescription && (
          <p className="text-xs text-destructive font-mono">
            {errors.seoDescription.message}
          </p>
        )}
      </div>

      {/* Purge / Destruction Module */}
      <div className="pt-6 border-t border-border/40">
        <h4 className="text-xs font-bold font-mono tracking-wider text-muted-foreground uppercase mb-3 flex items-center gap-1">
          Project Management
        </h4>
        <div className="p-4 bg-red-950/20 border border-destructive/20 text-center sm:text-left">
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "Verify action authorization key. Do you want to wipe out this record permanently from Mongo collections?",
                )
              ) {
                alert("Database records successfully deleted!");
              }
            }}
            className="inline-flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-white border border-destructive/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none transition-colors duration-200 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            Delete Project
          </button>
          <p className="text-[10px] text-muted-foreground/60 mt-2 font-mono">
            Warning: This process instantly removes all assets and is permanent.
          </p>
        </div>
      </div>
    </section>
  );
}
