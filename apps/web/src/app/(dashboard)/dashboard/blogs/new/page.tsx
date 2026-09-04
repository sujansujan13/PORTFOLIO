"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import BlogForm from "@/components/dashboard/blog-cms/edit/blog-edit-form-page";
import { type BlogFormInput, type BlogFormValues } from "@/schemas/blog.schema";
import { useCreateBlog } from "@/hooks/useDashboardBlog";

export default function BlogNewClientPage() {
  const router = useRouter();
  const createBlog = useCreateBlog();

  const defaultValues: BlogFormInput = {
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
  };

  const handleCreate = async (data: BlogFormValues) => {
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

  const handleDraft = async (data: BlogFormValues) => {
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
  };

  return (
    <BlogForm
      mode="create"
      defaultValues={defaultValues}
      onSubmit={handleCreate}
      onSaveDraft={handleDraft}
      isPending={createBlog.isPending}
    />
  );
}
