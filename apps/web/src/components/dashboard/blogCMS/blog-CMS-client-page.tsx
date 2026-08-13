"use client";
import React, { useMemo, useState } from "react";
import { Header } from "../lib/header";
import { SearchControlBar } from "../projects/search-control-bar";
import {
  useDashboardBlog,
  useDeleteMultipleBlogs,
} from "@/hooks/useDashboardBlog";
import { BlogTableView } from "./blog-table-view";
import { useDashboardSelection } from "@/hooks/useDashboardSelection";
import { BlogCardMobileView } from "./blog-card-moible";
import { DynamicPagination } from "../projects/dynamic-pagination";
import { BulkActionBar } from "../projects/bulk-action-bar";
import { toast } from "sonner";

export default function BlogCMSClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const blogsQuery = useDashboardBlog({
    search: searchQuery,
    page: currentPage,
    limit: 10,
  });

  const blogs = blogsQuery.data?.blogs ?? [];
  const pagination = blogsQuery.data?.pagination;

  const currentViewIds = useMemo(() => blogs.map((blog) => blog.id), [blogs]);

  const {
    selectedIds,
    selectedCount,
    toggleSelectRow,
    isAllSelected,
    toggleSelectAll,
    clearSelection,
  } = useDashboardSelection(currentViewIds);

  function handleSearchChange(query: string) {
    setSearchQuery(query);
    setCurrentPage(1);
    clearSelection();
  }

  const deleteMultipleBlogs = useDeleteMultipleBlogs();

  function handleDeleteBlogs(ids: string[]) {
    deleteMultipleBlogs.mutate(
      { ids },
      {
        onSuccess: () => {
          toast.success(
            `${ids.length} ${
              ids.length === 1 ? "Blog" : "Blogs"
            } deleted successfully`,
          );

          clearSelection();
        },

        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  }
  return (
    <main className="relative w-full min-h-screen p-4 sm:p-6 md:p-8  bg-background text-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <Header
          title="Blog"
          subTitle="Manage and publish blogs"
          linkTitle="New Blog"
          href="/dashboard/blogs/new"
        />

        <SearchControlBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Search blogs, categories, or status..."
        />
        {blogsQuery.isPending ? (
          <div className="w-full border border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        ) : blogsQuery.isError ? (
          <div className="w-full border border-destructive/40 p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Could not load projects.
            </p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="w-full border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No projects matching "{searchQuery}" could be found.
            </p>
          </div>
        ) : (
          <>
            <BlogTableView
              blogs={blogs}
              selectedIds={selectedIds}
              onToggleRow={toggleSelectRow}
              onToggleAll={toggleSelectAll}
            />

            <BlogCardMobileView
              blogs={blogs}
              selectedIds={selectedIds}
              onToggleRow={toggleSelectRow}
              onToggleAll={toggleSelectAll}
            />
          </>
        )}

        {pagination && (
          <DynamicPagination
            pagination={pagination}
            onPageChange={setCurrentPage}
          />
        )}

        {selectedCount > 0 && (
          <BulkActionBar
            selectedIds={selectedIds}
            selectedCount={selectedCount}
            itemName="blog"
            onDelete={handleDeleteBlogs}
          />
        )}
      </div>
    </main>
  );
}
