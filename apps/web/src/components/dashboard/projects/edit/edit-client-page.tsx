"use client";

// import { useEffect } from "react";
// import { projectFormSchema, type ProjectFormValues } from "@/schemas/project";
// import DualHeader from "../edit-new-page-header";
// import { useForm } from "react-hook-form";
// import MainSection from "../main-section";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { AdvancedSettingsCard } from "./advanced-settings-card";
import { useDashboardProject } from "@/hooks/useDashboardProjects";
import ProjectEditForm from "./project-edit-form";

interface EditClientProps {
  id: string;
}

export default function EditClient({ id }: EditClientProps) {
  const projectQuery = useDashboardProject(id);
  const { isPending, isError, data: project } = projectQuery;

  // Since project arrives later from the server, this won't work:
  // defaultValues: project,
  // const form = useForm<ProjectFormValues>({
  //   resolver: zodResolver(projectFormSchema),
  //   values: project,
  //   resetOptions: { keepDirtyValues: true },
  //   defaultValues: {
  //     // avoid `undefined` before data arrives
  //     techStack: [],
  //     toolsUsed: [],
  //     body: "",
  //   },
  // });

  // it is technically right but wrong in case of performance as this runs every time the component renders.
  // initialize(project);
  // reset() updates every form field with the fetched project.
  // useEffect(() => {
  //   if (project) {
  //     form.reset(project);

  //     setTimeout(() => {
  //       console.log("after reset", form.getValues());
  //     }, 0);
  //   }
  // }, [project, form]);

  if (isPending) {
    return <div>Loading Project...</div>;
  }

  if (isError) {
    return <div>Project Not Found</div>;
  }

  return (
    <ProjectEditForm key={project.id} project={project} />
    // <div className=" min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
    //   <form
    //     // onSubmit={handleSubmit(onSubmitFormAction)}
    //     className="w-full"
    //   >
    //     <DualHeader title={project?.title || "Edit Action"} desc="Edit Project">
    //       <div className="flex gap-0 md:gap-2">
    //         <button
    //           type="button"
    //           className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors cursor-pointer hover:bg-accent hover:rounded-md"
    //         >
    //           Discard Changes
    //         </button>
    //         <button
    //           type="submit"
    //           disabled={form.formState.isSubmitting}
    //           className="bg-primary text-white text-xs font-bold px-4 py-2 hover:bg-primary/90 shadow-md transition-colors disabled:opacity-50 cursor-pointer rounded-md"
    //         >
    //           {form.formState.isSubmitting ? "Processing..." : "Update Project"}
    //         </button>
    //       </div>
    //     </DualHeader>

    //     <MainSection form={form} />
    //     <div className="px-8">
    //       <AdvancedSettingsCard
    //         register={form.register}
    //         errors={form.formState.errors}
    //       />
    //     </div>
    //   </form>
    // </div>
  );
}
