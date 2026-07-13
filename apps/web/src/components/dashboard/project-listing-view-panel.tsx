// apps/web/components/dashboard/project-listing-view-panel.tsx
"use client";

import React from "react";
import { Search, Plus } from "lucide-react";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import { ProjectCard } from "./project-card-dashboard";
import Link from "next/link";

export function ProjectListingViewPanel({ projects }: { projects: any[] }) {
  const { searchQuery, setSearchQuery, openNewProjectModal } =
    useDashboardStore();

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t: string) =>
        t.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div className="space-y-5 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <h2 className="text-xl font-bold tracking-tight">Project Manager</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-input/40 border border-border pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary transition-colors rounded-sm"
            />
          </div>
          <Link
            href={"/dashboard/projects/new"}
            // onClick={openNewProjectModal}
            className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-2 hover:bg-primary/90 transition-colors rounded-sm h-8.5 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
