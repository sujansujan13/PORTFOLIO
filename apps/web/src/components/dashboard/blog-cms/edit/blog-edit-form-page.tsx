"use client";
import { useForm, Controller, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiptapEditor } from "@/components/dashboard/projects/tiptap-editor";
import staticOptions from "@/data/projects-option.json";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Plus } from "lucide-react";
import DualHeader from "@/components/dashboard/projects/edit-new-page-header";
import { MetaCard } from "@/components/dashboard/projects/meta-card";
import BlogDescription from "@/components/dashboard/blog-cms/shared/brief-description-blog";
import BlogAuthorPublishingCard from "@/components/dashboard/blog-cms/blog-author-publishing-card";
import BlogVisibility from "@/components/dashboard/blog-cms/shared/blog-visibility";
import { BlogImageUploader } from "@/components/dashboard/blog-cms/shared/blog-image-uploader";

import {
  blogFormSchema,
  type BlogFormInput,
  type BlogFormValues,
} from "@/schemas/blog.schema";
import { useGetCategories } from "@/hooks/useCategory";

interface BlogFormProps {
  defaultValues: BlogFormInput;
  mode: "create" | "edit";

  onSubmit: (data: BlogFormValues) => void | Promise<void>;
  onSaveDraft?: (data: BlogFormValues) => void | Promise<void>;

  isSubmitting?: boolean;
  isPending?: boolean;
}

export default function BlogForm({
  defaultValues,
  mode,
  onSubmit,
  onSaveDraft,
  isSubmitting = false,
  isPending: isMutationPending = false,
}: BlogFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormInput, unknown, BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues,
  });

  const categoriesQuery = useGetCategories({ type: "blog" });

  const categories = categoriesQuery.data || [];
  const isCategoriesLoading = categoriesQuery.isPending;

  const currentTitle = watch("title") || "Blog Post";
  const authorAvatar = watch("author.avatar");

  const handleFormSubmit = handleSubmit(
    async (data) => {
      await onSubmit(data);
    },
    (errors) => {
      console.log("Validation errors:");
      console.dir(errors, { depth: null });
    },
  );

  const handleDraft = onSaveDraft
    ? handleSubmit(
        async (data) => {
          await onSaveDraft(data);
        },
        (errors) => {
          console.log("Draft validation errors:");
          console.dir(errors, { depth: null });
        },
      )
    : undefined;

  const busy = isSubmitting || isMutationPending;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <form onSubmit={handleFormSubmit} className="w-full">
        <DualHeader
          backLabel="Go to Blogs"
          backHref="/dashboard/blogs"
          title={mode === "create" ? "Workspace Action" : "Workspace Action"}
          desc={mode === "create" ? "Create New Blog" : "Edit Blog"}
        >
          {onSaveDraft && (
            <button
              type="button"
              onClick={handleDraft}
              disabled={busy}
              className="text-xs font-bold text-muted-foreground hover:text-foreground px-3 py-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              Save as Draft
            </button>
          )}

          <button
            type="submit"
            disabled={busy}
            className="bg-primary text-white text-xs font-bold px-4 py-2 hover:bg-primary/90 shadow-md transition-colors disabled:opacity-50 cursor-pointer rounded-md"
          >
            {busy
              ? "Processing..."
              : mode === "create"
                ? "Create Blog"
                : "Update Blog"}
          </button>
        </DualHeader>

        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* =====================================================
              LEFT COLUMN
          ====================================================== */}
          <section className="lg:col-span-2 space-y-6">
            {/* Blog title / description / slug */}
            <div className="w-full bg-card border border-border p-5 rounded-md space-y-4 text-left">
              <BlogDescription
                register={register}
                errors={errors}
                setValue={setValue}
              />
            </div>

            {/* Blog body */}
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

            {/* Featured image */}
            <Controller
              name="featuredImage"
              control={control}
              render={({ field, fieldState }) => (
                <BlogImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </section>

          {/* =====================================================
              RIGHT COLUMN
          ====================================================== */}
          <section className="space-y-6">
            {/* Visibility */}
            <BlogVisibility register={register} />

            {/* Author + publishing */}
            <BlogAuthorPublishingCard
              register={register}
              setValue={setValue}
              errors={errors}
              avatar={authorAvatar}
              control={control}
            />

            {/* Category */}
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
                disabled={isCategoriesLoading || categories.length === 0}
                className="w-full bg-input/40 border border-border p-2.5 text-xs font-medium tracking-wider focus:outline-none focus:border-primary transition-colors rounded-sm text-foreground appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a855f7' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>")`,
                  backgroundPosition: "right 10px center",
                  backgroundSize: "16px",
                  backgroundRepeat: "no-repeat",
                }}
              > 
                <option value="">
                  {isCategoriesLoading
                    ? "Loading categories..."
                    : categories.length === 0
                      ? "No blog categories found"
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
                <p className="text-xs text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* SEO */}
            <MetaCard register={register} errors={errors} />

            {/* Preview */}
            <div className="bg-card border border-border p-4 rounded-md text-left space-y-3 overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Card Preview
              </h3>

              <div className="relative aspect-video w-full bg-muted overflow-hidden border border-border/40 rounded-md">
                <Image
                  src={
                    watch("featuredImage") ||
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
                  }
                  alt="Blog preview"
                  fill
                  unoptimized
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
                    {watch("description") || "Blog description"}
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
