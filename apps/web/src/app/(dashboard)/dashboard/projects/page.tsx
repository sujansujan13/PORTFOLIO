"use client";

import { useProjectStore } from "@/stores/useProjectStore";
import { ProjectHeader } from "@/components/dashboard/projects/project-header";
import { SearchControlBar } from "@/components/dashboard/projects/search-control-bar";
import { ProjectTableView } from "@/components/dashboard/projects/project-table-view";
import { ProjectCardMobileView } from "@/components/dashboard/projects/project-card-mobile";
import { BulkActionBar } from "@/components/dashboard/projects/bulk-action-bar";
import { DynamicPagination } from "@/components/dashboard/projects/dynamic-pagination";

export default function ProjectManagerPage() {
  const { projects, searchQuery } = useProjectStore();

  // Handle client-side search logic
  const filteredProjects = projects.filter((project) => {
    const matchesTitle = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSubtitle = project.subtitle
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = project.category
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTitle || matchesSubtitle || matchesCategory;
  });

  return (
    <main className="w-full min-h-screen p-4 sm:p-6 md:p-8  bg-background text-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        {/* Title, Subtitle, and Routing Trigger Actions */}
        <ProjectHeader />

        {/* Global State Driven Search Control Component */}
        <SearchControlBar />

        {/* Empty Search Fallback */}
        {filteredProjects.length === 0 ? (
          <div className="w-full border border-dashed border-border p-12 text-center bg-card/5 rounded-none">
            <p className="text-sm text-muted-foreground font-sans">
              No cloud infrastructure matching &ldquo;{searchQuery}&rdquo; could
              be found.
            </p>
          </div>
        ) : (
          <>
            {/* Breakpoint Engine - Desktop Multi-Column Matrix View */}
            <ProjectTableView filteredProjects={filteredProjects} />

            {/* Breakpoint Engine - Mobile Structured Stacked Card View */}
            <ProjectCardMobileView filteredProjects={filteredProjects} />
          </>
        )}

        {/* Footprint Symmetrical Pagination */}
        <DynamicPagination totalCount={filteredProjects.length} />

        {/* Standalone Absolute Staged Actions Overlay Panel */}
        <BulkActionBar />
      </div>
    </main>
  );
}
