"use client";

import { Edit3, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import type { BlogDashboard } from "@my-portfolio/api/schemas/Blogs/blog.schema";
import { useDeleteBlog } from "@/hooks/useDashboardBlog";

export interface BlogTableViewProps {
  blogs: BlogDashboard[];
  selectedIds: string[];
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
}

export function BlogTableView({
  blogs,
  selectedIds,
  onToggleRow,
  onToggleAll,
}: BlogTableViewProps) {
  const deleteSingle = useDeleteBlog();

  const currentViewIds = blogs.map((blog) => blog.id);

  const isAllChecked =
    currentViewIds.length > 0 &&
    currentViewIds.every((id) => selectedIds.includes(id));

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
    <div className="hidden md:block w-full border border-border bg-card/20 rounded-lg overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-[#0a1829]/60 font-bold uppercase tracking-wider dark:text-muted-foreground text-white font-mono select-none">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={onToggleAll}
                className="w-4 h-4 accent-primary rounded-none cursor-pointer"
              />
            </th>

            <th className="p-4 text-xs">Blogs</th>

            <th className="p-4 text-xs">Category</th>

            <th className="p-4 text-xs">Author</th>

            <th className="p-4 text-xs">Status</th>

            <th className="p-4 text-xs text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {blogs.map((blog) => {
            const isRowSelected = selectedIds.includes(blog.id);

            return (
              <tr
                key={blog.id}
                className={`transition-colors duration-150 group ${
                  isRowSelected ? "bg-[#11253e]/10" : "hover:bg-[#0f223a]/20"
                }`}
              >
                {/* Selection */}
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={isRowSelected}
                    onChange={() => onToggleRow(blog.id)}
                    className="w-4 h-4 accent-primary rounded-none cursor-pointer"
                  />
                </td>

                {/* Blog info */}
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={blog.featuredImage}
                      alt=""
                      width={40}
                      height={40}
                      aria-hidden="true"
                      className="w-10 h-10 object-cover border border-border rounded-sm bg-black/20"
                      unoptimized
                    />

                    <div>
                      <h2 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors font-sans">
                        {blog.title}
                      </h2>

                      {/* <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                        By {blog.authorName}
                      </p> */}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="p-4">
                  <span className="text-[10px] font-mono font-bold tracking-wider dark:bg-[#1d3557] dark:text-blue-400 px-2 py-1 rounded-sm border border-gray-700 uppercase whitespace-nowrap inline-block">
                    {blog.category}
                  </span>
                </td>

                {/* Author */}
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">
                    {blog.authorName}
                  </span>
                </td>

                {/* Status */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border py-1 px-2 rounded-md">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          blog.publicAccess
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-gray-500"
                        }`}
                      />

                      <span className="text-xs font-medium font-mono">
                        {blog.publicAccess ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    <a
                      href={`/dashboard/blogs/${blog.id}/edit`}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-none outline-none focus:ring-1 focus:ring-ring"
                      title="Edit Blog"
                    >
                      <Edit3 className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => deleteSingleBlog(blog.id)}
                      disabled={deleteSingle.isPending}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-none outline-none focus:ring-1 focus:ring-ring cursor-pointer disabled:opacity-50"
                      title="Delete Blog"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
