import { useState } from "react"; // 👈 1. Add useState import
import { projectFormSchema, type ProjectFormValues } from "@/schemas/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import DualHeader from "../edit-new-page-header";
import MainSection from "../main-section";
import { AdvancedSettingsCard } from "./advanced-settings-card";
import { useUpdateProject } from "@/hooks/useDashboardProjects";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DiscardChangesDialog } from "./discard-cahnges-dialog";

export default function ProjectEditForm({
  project,
}: {
  project: ProjectFormValues;
}) {
  const [resetKey, setResetKey] = useState(0); // 👈 2. Add resetKey state

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project,
  });

  console.log(project.id);
  console.log(typeof project.id);

  const updateProject = useUpdateProject();
  const router = useRouter();

  async function onSubmitFormAction(data: ProjectFormValues) {
    const projectId = data.id || project.id;
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    updateProject.mutate(
      {
        ...data,
        id: projectId,
      },
      {
        onSuccess: () => {
          toast.success("Project Updated SuccessFully");
          router.push("/dashboard/projects");
        },
        onError: (error) => {
          toast.error(error.message || "Error updating project");
        },
      },
    );
  }

  // 👈 3. Define handleDiscard function
  function handleDiscard() {
    form.reset(project);
    setResetKey((prev) => prev + 1); // Triggers DOM remount with fresh defaultValues
    toast.success("Changes discarded");
  }

  return (
    // 👈 4. Attach key={resetKey} to the wrapper div
    <div
      key={resetKey}
      className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30"
    >
      <form
        onSubmit={form.handleSubmit(onSubmitFormAction, (errors) =>
          console.log("Validation errors:", errors),
        )}
        className="w-full"
      >
        <DualHeader
          backHref="/dashboard/projects"
          backLabel="Back to Projects "
          title={project?.title || "Edit Action"}
          desc="Edit Project"
        >
          <div className="flex gap-0 md:gap-2">
            <DiscardChangesDialog
              disabled={!form.formState.isDirty}
              onDiscard={handleDiscard}
            />
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
          />
        </div>
      </form>
    </div>
  );
}
