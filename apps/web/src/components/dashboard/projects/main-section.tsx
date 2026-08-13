import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import { TiptapEditor } from "./tiptap-editor";
import { FileUploader } from "../lib/file-uploader";
import staticOptions from "@/data/projects-option.json";
import { Globe, Link2, Plus, Rocket, X } from "lucide-react";
import Image from "next/image";

import { type ProjectFormValues } from "@/schemas/project";
import BriefDescription from "../lib/brief-description";
import ProjectSpecificField from "../lib/project-specific-field";
import ProjectVisibility from "./project-visibilty-card";
import TagInputField from "../forms/tag-input-field";
import { MetricsFieldArray } from "./metrics-field-array";
import { FeaturesFieldArray } from "./features-field-array";
interface formProps {
  form: UseFormReturn<ProjectFormValues>;
}

export default function MainSection({ form }: formProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const currentStack = useWatch({ control, name: "techStack" }) || [];
  const toolsUsed = useWatch({ control, name: "toolsUsed" }) || [];
  const currentTitle = useWatch({ control, name: "title" }) || "Project Title";
  const currentSubtitle =
    useWatch({ control, name: "subtitle" }) || "Sub-platform node definition";

  const heroUrl = useWatch({ control, name: "heroImageUrl" });
  const thumbUrl = useWatch({ control, name: "thumbImageUrl" });

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

  // ADD these — the actual "commit" logic, now triggered by TagInputField's onAdd
  const handleAddTechTag = (value: string) => {
    console.log(
      "handleAddTechTag fired with:",
      value,
      "currentStack:",
      currentStack,
    );
    if (!currentStack.includes(value)) {
      setValue("techStack", [...currentStack, value], {
        shouldValidate: true,
        shouldDirty: true,
      });
      console.log("after setValue, watch says:", watch("techStack"));
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

  return (
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

        {/* Drag & Drop Module */}
        <FileUploader
          heroUrl={heroUrl}
          thumbnailUrl={thumbUrl}
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Category
          </h3>
          <select
            {...register("category")}
            className="w-full bg-input/40 border border-border p-2.5 text-xs font-medium tracking-wider focus:outline-none focus:border-primary transition-colors rounded-sm text-foreground appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a855f7' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
              backgroundPosition: "right 10px center",
              backgroundSize: "16px",
              backgroundRepeat: "no-repeat",
            }}
          >
            {staticOptions.categories.map((cat) => (
              <option
                key={cat.value}
                value={cat.value}
                className="bg-card text-foreground font-medium"
              >
                {cat.label}
              </option>
            ))}
          </select>
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
  );
}
