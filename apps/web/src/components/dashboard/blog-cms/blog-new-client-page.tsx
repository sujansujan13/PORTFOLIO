"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TiptapEditor } from "@/components/dashboard/projects/tiptap-editor";
import staticOptions from "@/data/projects-option.json";
import Image from "next/image";
import DualHeader from "@/components/dashboard/projects/edit-new-page-header";
import { MetaCard } from "@/components/dashboard/projects/meta-card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateBlog } from "@/hooks/useDashboardBlog";
import BlogDescription from "./shared/brief-description-blog";
import {
  blogFormSchema,
  type BlogFormInput,
  type BlogFormValues,
} from "@/schemas/blog.schema";
import BlogAuthorPublishingCard from "./blog-author-publishing-card";
import BlogVisibility from "./shared/blog-visibility";
import { BlogImageUploader } from "./shared/blog-image-uploader";

export default function BlogNewClientPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormInput, unknown, BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
      body: {
        type: "doc",
        content: [],
      },
      publicAccess: false,
      category: "",
      featuredImage: "",
      publishedAt: new Date(),
      seoTitle: "",
      seoDescription: "",
      author: {
        name: "",
        role: "",
        avatar: "",
      },
    },
  });

  const currentTitle = watch("title") || "Project Title";

  const authorAvatar = watch("author.avatar");

  const router = useRouter();
  const createBlog = useCreateBlog();

  const onSubmitFormAction = async (data: BlogFormValues) => {
    console.log("Submitting...", data);
    createBlog.mutate(data, {
      onSuccess: () => {
        toast.success("Blog Post created successfully");
        router.push("/dashboard/blogs");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create blog post");
      },
    });
  };

  const handleSaveDraft = handleSubmit((data) => {
    createBlog.mutate(
      {
        ...data,
        publicAccess: false,
      },
      {
        onSuccess: () => {
          toast.success("Blog Post saved as draft");
          router.push("/dashboard/blogs");
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
          backLabel="Back to Blogs"
          backHref="/dashboard/blogs"
          title="Workspace Action"
          desc="Create New Blog"
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
            disabled={isSubmitting || createBlog.isPending}
            className="bg-primary text-white text-xs font-bold px-4 py-2 hover:bg-primary/90 shadow-md transition-colors disabled:opacity-50 cursor-pointer rounded-md"
          >
            {isSubmitting || createBlog.isPending
              ? "Processing..."
              : "Create Blog"}
          </button>
        </DualHeader>

        {/* Core Multi-Column Structural Grid Layout Layout */}
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PRIMARY CONFIGURATION COLUMN (Wider Component Layer) */}
          <section className="lg:col-span-2 space-y-6">
            {/* Title Metadata Block */}
            <div className="w-full bg-card border border-border p-5 rounded-md space-y-4 text-left">
              <BlogDescription
                register={register}
                errors={errors}
                setValue={setValue}
              />
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

          {/* RIGHT METADATA CONTROL COLUMN (Sidebar Component Layer) */}
          <section className="space-y-6">
            {/* Visibility Settings Panel Card */}
            <BlogVisibility register={register} />

            <BlogAuthorPublishingCard
              register={register}
              setValue={setValue}
              errors={errors}
              avatar={authorAvatar}
              control={control}
            />

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
                    {/* {currentSubtitle} */}
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
