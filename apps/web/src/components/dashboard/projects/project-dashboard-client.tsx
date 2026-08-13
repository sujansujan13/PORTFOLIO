"use client";
import { useMemo, useState } from "react";
import { Header } from "@/components/dashboard/lib/header";
import { SearchControlBar } from "@/components/dashboard/projects/search-control-bar";
import { ProjectTableView } from "@/components/dashboard/projects/project-table-view";
import { ProjectCardMobileView } from "@/components/dashboard/projects/project-card-mobile";
import { BulkActionBar } from "@/components/dashboard/projects/bulk-action-bar";
import { DynamicPagination } from "@/components/dashboard/projects/dynamic-pagination";
import {
  useDashboardProjects,
  useDeleteManyProjects,
} from "@/hooks/useDashboardProjects";
import { useDashboardSelection } from "@/hooks/useDashboardSelection";
import { toast } from "sonner";

export default function ProjectManagerPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const projectsQuery = useDashboardProjects({
    search: searchQuery,
    page: currentPage,
    limit: 10,
  });

  const projects = projectsQuery.data?.projects ?? [];
  const pagination = projectsQuery.data?.pagination;

  const currentViewIds = useMemo(
    () => projects.map((project) => project.id),
    [projects],
  );

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

  const deleteMultipleProjects = useDeleteManyProjects();

  function handleDeleteProjects(ids: string[]) {
    deleteMultipleProjects.mutate(
      { ids },
      {
        onSuccess: () => {
          toast.success(
            `${ids.length} ${
              ids.length === 1 ? "Project" : "Projects"
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
    <main className="relative w-full min-h-screen p-4 sm:p-6 md:p-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto flex flex-col h-full">
        <Header
          title="Projects"
          subTitle="Manage and deploy your cloud infrastructure"
          linkTitle="New Project"
          href="/dashboard/projects/new"
        />

        <SearchControlBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder="Search projects, categories, or status..."
        />

        {projectsQuery.isPending ? (
          <div className="w-full border border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        ) : projectsQuery.isError ? (
          <div className="w-full border border-destructive/40 p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Could not load projects.
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="w-full border border-dashed border-border p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No projects matching "{searchQuery}" could be found.
            </p>
          </div>
        ) : (
          <>
            <ProjectTableView
              projects={projects}
              selectedIds={selectedIds}
              isAllSelected={isAllSelected}
              onToggleRow={toggleSelectRow}
              onToggleAll={toggleSelectAll}
            />

            <ProjectCardMobileView
              projects={projects}
              isAllSelected={isAllSelected}
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
            itemName="project"
            onDelete={handleDeleteProjects}
          />
        )}
      </div>
    </main>
  );
}
