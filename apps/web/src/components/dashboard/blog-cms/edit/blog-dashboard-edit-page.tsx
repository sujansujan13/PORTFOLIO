"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import BlogForm from "./blog-edit-form-page";
import { useDashboardBlogById, useUpdateBlog } from "@/hooks/useDashboardBlog";
import type { BlogFormInput, BlogFormValues } from "@/schemas/blog.schema";

interface EditBlogPageProps {
  blogId: string;
}

export default function EditBlogClientPage({ blogId }: EditBlogPageProps) {
  const router = useRouter();

  const { data: blog, isLoading } = useDashboardBlogById(blogId);
  console.log(blog);
  const updateBlog = useUpdateBlog();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-destructive">
        Blog not found.
      </div>
    );
  }

  const defaultValues: BlogFormInput = {
    title: blog.title,
    description: blog.description,
    slug: blog.slug,

    body: blog.body,

    publicAccess: blog.publicAccess,

    category: blog.category,

    featuredImage: blog.featuredImage ?? "",

    publishedAt: new Date(blog.publishedAt),

    seoTitle: blog.seoTitle,
    seoDescription: blog.seoDescription,

    author: {
      name: blog.author.name,
      role: blog.author.role,
      avatar: blog.author.avatar ?? "",
    },
  };

  const handleUpdate = async (data: BlogFormValues) => {
    updateBlog.mutate(
      {
        id: blogId,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Blog updated successfully");
          router.push("/dashboard/blogs");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update blog");
        },
      },
    );
  };

  const handleSaveDraft = async (data: BlogFormValues) => {
    updateBlog.mutate(
      {
        id: blogId,
        ...data,
        publicAccess: false,
      },
      {
        onSuccess: () => {
          toast.success("Blog saved as draft");
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
      mode="edit"
      defaultValues={defaultValues}
      onSubmit={handleUpdate}
      onSaveDraft={handleSaveDraft}
      isPending={updateBlog.isPending}
    />
  );
}
