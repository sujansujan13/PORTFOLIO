"use client";

import { Edit3, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import type { BlogDashboard } from "@my-portfolio/api/schemas/blogs/blog.schema";
import { useDeleteBlog } from "@/hooks/useDashboardBlog";

export interface BlogCardMobileViewProps {
  blogs: BlogDashboard[];
  selectedIds: string[];
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
}

export function BlogCardMobileView({
  blogs,
  selectedIds,
  onToggleRow,
}: BlogCardMobileViewProps) {
  const deleteSingle = useDeleteBlog();

  function deleteSingleBlog(id: string) {
    deleteSingle.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Blog deleted successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Error deleting blog");
        },
      },
    );
  }

  return (
    <div className="md:hidden flex flex-col gap-3">
      {blogs.map((blog) => {
        const isSelected = selectedIds.includes(blog.id);

        return (
          <div
            key={blog.id}
            className={`border border-border rounded-lg bg-card/20 p-4 transition-colors ${
              isSelected ? "bg-[#11253e]" : ""
            }`}
          >
            {/* Top section */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleRow(blog.id)}
                className="mt-1 w-4 h-4 accent-primary rounded-none cursor-pointer"
              />

              <Image
                src={blog.featuredImage}
                alt=""
                width={48}
                height={48}
                aria-hidden="true"
                className="w-12 h-12 object-cover border border-border rounded-sm bg-black/20 shrink-0"
                unoptimized
              />

              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-sm text-foreground truncate">
                  {blog.title}
                </h2>

                <p className="text-xs text-muted-foreground mt-1">
                  By {blog.authorName}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider dark:bg-[#1d3557] dark:text-blue-400 px-2 py-1 rounded-sm border border-gray-700 uppercase">
                {blog.category}
              </span>

              <div className="flex items-center gap-2 border py-1 px-2 rounded-md">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    blog.publicAccess
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-gray-500"
                  }`}
                />

                <span className="text-xs font-medium font-mono">
                  {blog.publicAccess ? "public" : "private"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-3">
              <a
                href={`/dashboard/blogs/${blog.id}/edit`}
                className="inline-flex items-center gap-2 px-3 py-2 border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </a>

              <button
                type="button"
                onClick={() => deleteSingleBlog(blog.id)}
                disabled={deleteSingle.isPending}
                className="inline-flex items-center gap-2 px-3 py-2 border border-border text-xs text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
