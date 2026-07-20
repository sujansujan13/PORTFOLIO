"use client";

import React, { useEffect } from "react";
import { projectFormSchema, type ProjectFormValues } from "@/schemas/project";
import { useEditStore } from "@/stores/useEditStore";
import DualHeader from "../edit-new-page-header";
import { useForm } from "react-hook-form";
import MainSection from "../main-section";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdvancedSettingsCard } from "./advanced-settings-card";

interface EditClientProps {
  project: ProjectFormValues;
}

export default function EditClient({ project }: EditClientProps) {
  const { initialize } = useEditStore();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project,
  });

  // it is technically right but wrong in case of performance as this runs every time the component renders.
  // initialize(project);
  useEffect(() => {
    initialize(project);
  }, [project]);
  return (
    <div className=" min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <form
        // onSubmit={handleSubmit(onSubmitFormAction)}
        className="w-full"
      >
        <DualHeader title={project.title || "Edit Action"} desc="Edit Project">
          <div className="flex gap-0 md:gap-2">
            <button
              type="button"
              className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors cursor-pointer hover:bg-accent hover:rounded-md"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-primary text-white text-xs font-bold px-4 py-2 hover:bg-primary/90 shadow-md transition-colors disabled:opacity-50 cursor-pointer rounded-md"
            >
              {form.formState.isSubmitting ? "Processing..." : "Update Project"}
            </button>
          </div>
        </DualHeader>

        <MainSection form={form} />
        <div className="px-8">
          <AdvancedSettingsCard
            register={form.register}
            errors={form.formState.errors}
            customSlug=""
          />
        </div>
      </form>
    </div>
  );
}
