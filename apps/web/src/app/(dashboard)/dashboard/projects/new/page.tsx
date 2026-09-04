"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Route } from "next";
import { Link2, Rocket, Plus } from "lucide-react";
import Link from "next/link";
import { projectFormSchema, type ProjectFormValues } from "@/schemas/project";
import { TiptapEditor } from "@/components/dashboard/projects/tiptap-editor";
import { FileUploader } from "@/components/dashboard/lib/file-uploader";
import staticOptions from "@/data/projects-option.json";
import Image from "next/image";
import DualHeader from "@/components/dashboard/projects/edit-new-page-header";
import BriefDescription from "@/components/dashboard/lib/brief-description";
import ProjectSpecificField from "@/components/dashboard/lib/project-specific-field";
import ProjectVisibility from "@/components/dashboard/projects/project-visibility-card";

import TagInputField from "@/components/dashboard/forms/tag-input-field";
import { MetricsFieldArray } from "@/components/dashboard/projects/metrics-field-array";
import { FeaturesFieldArray } from "@/components/dashboard/projects/features-field-array";
import { MetaCard } from "@/components/dashboard/projects/meta-card";
import { useCreateProject } from "@/hooks/useDashboardProjects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetCategories } from "@/hooks/useCategory";

export default function CreateProjectWorkspacePage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      body: {
        type: "doc",
        content: [],
      },
      publicAccess: true,
      techStack: [],
      category: "",
      githubUrl: "",
      liveUrl: "",
      heroImageUrl: "",
      thumbImageUrl: "",
      role: "",
      timeline: "",
      customSlug: "",
      toolsUsed: [],
      featured: false,
      metrics: [],
      features: [],
      seoTitle: "",
      seoDescription: "",
    },
  });

  const currentStack = watch("techStack") || [];
  const currentTitle = watch("title") || "Project Title";
  const currentSubtitle = watch("subtitle") || "Sub-platform node definition";

  const toolsUsed = watch("toolsUsed") || [];

  const categoriesQuery = useGetCategories({ type: "project" });

  const categories = categoriesQuery.data ?? [];
  const { isPending, isError } = categoriesQuery;

  // REPLACE these two handlers
  const handleAddTechTag = (value: string) => {
    if (!currentStack.includes(value)) {
      setValue("techStack", [...currentStack, value], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleAddToolTag = (value: string) => {
    if (!toolsUsed.includes(value)) {
      setValue("toolsUsed", [...toolsUsed, value], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleRemoveTechTag = (tag: string) => {
    setValue(
      "techStack",
      currentStack.filter((t) => t !== tag),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const handleRemoveToolTag = (tool: string) => {
    setValue(
      "toolsUsed",
      toolsUsed.filter((t) => t !== tool),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const router = useRouter();
  const createProject = useCreateProject();

  const onSubmitFormAction = async (data: ProjectFormValues) => {
    console.log("Submitting...", data);
    createProject.mutate(data, {
      onSuccess: () => {
        toast.success("Project created successfully");
        router.push("/dashboard/projects");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create project");
      },
    });
  };

  const handleSaveDraft = handleSubmit((data) => {
    createProject.mutate(
      {
        ...data,
        publicAccess: false,
        featured: false,
      },
      {
        onSuccess: () => {
          toast.success("Project saved as draft");
          router.push("/dashboard/projects");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save draft");
        },
      },
    );
  });

  return (
    <div className=" min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* SEO/Accessibility semantic header wrapper matching mockup */}
      <form
        onSubmit={handleSubmit(onSubmitFormAction, (errors) => {
          console.log(errors);
          console.dir(errors, { depth: null });
        })}
        className="w-full"
      >
        <DualHeader
          backLabel="Go to Projects"
          backHref="/dashboard/projects"
          title="Workspace Action"
          desc="Create New Project"
        >
          <button
            type="button"
            onClick={handleSaveDraft}
            className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors cursor-pointer"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting || createProject.isPending}
            className="bg-primary text-white text-xs font-bold px-4 py-2 hover:bg-primary/90 shadow-md transition-colors disabled:opacity-50 cursor-pointer rounded-md"
          >
            {isSubmitting || createProject.isPending
              ? "Processing..."
              : "Create Project"}
          </button>
        </DualHeader>

        {/* Core Multi-Column Structural Grid Layout Layout */}
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PRIMARY CONFIGURATION COLUMN (Wider Component Layer) */}
          <section className="lg:col-span-2 space-y-6">
            {/* Title Metadata Block */}
            <div className="w-full bg-card border border-border p-5 rounded-md space-y-4 text-left">
              <BriefDescription
                register={register}
                errors={errors}
                setValue={setValue}
              />
              <ProjectSpecificField register={register} errors={errors} />
            </div>

            {/* Content Field Layer Component */}
            <div className="bg-card border border-border p-5 rounded-md space-y-3 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Detailed Description
              </label>
              <Controller
                name="body"
                control={control}
                render={({ field }) => (
                  <TiptapEditor value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.body && (
                <span className="text-destructive text-xs mt-1 block font-medium">
                  {errors.body.message}
                </span>
              )}
            </div>

            <MetricsFieldArray
              control={control}
              register={register}
              errors={errors}
            />

            <FeaturesFieldArray
              control={control}
              register={register}
              errors={errors}
            />

            {/* Drag & Drop Module */}
            <FileUploader
              onHeroChange={(url) =>
                setValue("heroImageUrl", url, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              onThumbnailChange={(url) =>
                setValue("thumbImageUrl", url, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          </section>

          {/* RIGHT METADATA CONTROL COLUMN (Sidebar Component Layer) */}
          <section className="space-y-6">
            {/* Visibility Settings Panel Card */}
            <ProjectVisibility register={register} />

            {/* Dynamic Tech Tag Manager Card Block */}
            <div className="flex flex-col bg-card border border-border p-5 rounded-md text-left space-y-5">
              <TagInputField
                title="Tech Stack"
                placeholder="Add Technologies..."
                values={currentStack}
                onRemove={handleRemoveTechTag}
                onAdd={handleAddTechTag}
                error={errors.techStack?.message}
              />
              <TagInputField
                title="Tools Used"
                placeholder="Add Tools..."
                values={toolsUsed}
                onRemove={handleRemoveToolTag}
                onAdd={handleAddToolTag}
                error={errors.toolsUsed?.message}
              />
            </div>

            {/* Category Dropdown Selection Panel */}
            <div className="bg-card border border-border p-5 rounded-md text-left space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </h3>
                <Link
                  href={"/dashboard/categories" as Route}
                  className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Manage
                </Link>
              </div>
              <select
                {...register("category")}
                disabled={isPending || categories.length === 0}
                className="w-full bg-input/40 border border-border p-2.5 text-xs font-medium tracking-wider focus:outline-none focus:border-primary transition-colors rounded-sm text-foreground appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a855f7' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
                  backgroundPosition: "right 10px center",
                  backgroundSize: "16px",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value="">
                  {isPending
                    ? "Loading categories..."
                    : categories.length === 0
                      ? "No project categories found"
                      : "Select a Category"}
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.slug}
                    className="bg-card text-foreground font-medium"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-destructive text-xs mt-1 block font-medium">
                  {errors.category.message}
                </span>
              )}
            </div>

            {/* External Action Deployment Track Links */}
            <div className="bg-card border border-border p-5 rounded-md text-left space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Deployment Links
              </h3>
              <div className="relative">
                <Link2 className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="GitHub Repository URL"
                  {...register("githubUrl")}
                  className="w-full bg-input/40 border border-border pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors rounded-sm"
                />
              </div>
              <div className="relative">
                <Rocket className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Live Demo URL"
                  {...register("liveUrl")}
                  className="w-full bg-input/40 border border-border pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors rounded-sm"
                />
              </div>
            </div>

            <MetaCard register={register} errors={errors} />

            {/* Real-time Dynamic Portfolio Preview Subcard Box */}
            <div className="bg-card border border-border p-4 rounded-md text-left space-y-3 overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Card Preview
              </h3>
              <div className="relative aspect-video w-full bg-muted overflow-hidden border border-border/40 rounded-md">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
                  alt="Live Mock Preview"
                  fill
                  className="object-cover w-full h-full opacity-60 filter saturate-50"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[9px] font-extrabold bg-primary text-white px-1.5 py-0.5 rounded-md tracking-wider uppercase">
                    Preview
                  </span>
                  <h4 className="text-xs font-bold text-white truncate mt-1.5">
                    {currentTitle}
                  </h4>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {currentSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </form>
    </div>
  );
}

// HTML
//
// tooltip
// for manual tooltip we can either use the default attribute of html known as title=""
// <Code> title="Back to Projects"
// but it appears a bit late so we can css attribute like opacity-0, group-hover:opacity-100
// <Code>
// <span className="px-4 py-2 hidden lg:flex bg-gray-950 rounded-lg opacity-0 group-hover:opacity-100 absolute mt-5 text-xs font-semibold">
//   Back to Projects
// </span>
