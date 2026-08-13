"use client";

import { Settings, ShieldAlert } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { projectFormSchema, type ProjectFormValues } from "@/schemas/project";
import { MetaCard } from "../meta-card";

interface AdvancedSettingsCardProps {
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
}

export function AdvancedSettingsCard({
  register,
  errors,
}: AdvancedSettingsCardProps) {
  return (
    <section className="bg-card border border-border p-6 rounded-md space-y-6">
      <MetaCard register={register} errors={errors} />

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
