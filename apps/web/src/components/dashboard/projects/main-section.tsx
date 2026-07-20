import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { TiptapEditor } from "./tiptap-editor";
import { FileUploader } from "./file-uploader";
import staticOptions from "@/data/projects-option.json";
import { Globe, Link2, Plus, Rocket, X } from "lucide-react";
import Image from "next/image";

import { type ProjectFormValues } from "@/schemas/project";
import { AdvancedSettingsCard } from "./edit/advanced-settings-card";
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

  const currentStack = watch("techStack") || [];
  const currentTitle = watch("title") || "Project Title";
  const currentSubtitle = watch("subtitle") || "Sub-platform node definition";

  const handleRemoveTechTag = (tag: string) => {
    setValue(
      "techStack",
      currentStack.filter((t) => t !== tag),
    );
  };

  const handleAddTechTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !currentStack.includes(value)) {
        setValue("techStack", [...currentStack, value]);
        e.currentTarget.value = "";
      }
    }
  };

  return (
    <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT PRIMARY CONFIGURATION COLUMN (Wider Component Layer) */}
      <section className="lg:col-span-2 space-y-6">
        {/* Title Metadata Block */}
        <div className="bg-card border border-border p-5 rounded-md space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Portfolio v2.0"
              {...register("title")}
              className="w-full bg-input/40 border border-border p-2.5 text-sm font-sans focus:outline-none focus:border-primary transition-all rounded-sm placeholder:text-muted-foreground/60"
            />
            {errors.title && (
              <span className="text-destructive text-xs mt-1.5 block font-medium">
                {errors.title.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Platform Subtitle
            </label>
            <input
              type="text"
              placeholder="e.g. Web Development Portfolio"
              {...register("subtitle")}
              className="w-full bg-input/40 border border-border p-2.5 text-sm font-sans focus:outline-none focus:border-primary transition-all rounded-sm placeholder:text-muted-foreground/60"
            />
            {errors.subtitle && (
              <span className="text-destructive text-xs mt-1.5 block font-medium">
                {errors.subtitle.message}
              </span>
            )}
          </div>
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
        <FileUploader />
      </section>

      {/* RIGHT METADATA CONTROL COLUMN (Sidebar Component Layer) */}
      <section className="space-y-6">
        {/* Visibility Settings Panel Card */}
        <div className="bg-card border border-border p-5 rounded-md text-left space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Project Visibility
          </h3>
          <div className="flex items-center justify-between p-3 bg-background/40 border border-border rounded-md">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-bold">Public Access</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Visible on live portfolio index
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                {...register("publicAccess")}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Dynamic Tech Tag Manager Card Block */}
        <div className="bg-card border border-border p-5 rounded-md text-left space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tech Stack
            </h3>
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-1.5 p-2 bg-background/20 border border-border/80 rounded-md min-h-10.5">
            {currentStack.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-md"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTechTag(tag)}
                  className="hover:text-destructive transition-colors cursor-pointer"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add more technologies..."
            onKeyDown={handleAddTechTag}
            className="w-full bg-input/40 border border-border p-2 text-xs focus:outline-none focus:border-primary transition-colors rounded-sm"
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
