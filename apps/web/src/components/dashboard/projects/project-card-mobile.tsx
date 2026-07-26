"use client";

import { Edit3, Trash2 } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";
import type { ProjectRecord } from "@/data/mockprojects-dashboard";

interface MobileViewProps {
  filteredProjects: ProjectRecord[];
}

export function ProjectCardMobileView({ filteredProjects }: MobileViewProps) {
  const { selectedIds, toggleSelectRow, toggleSelectAll, deleteSingleProject } =
    useProjectStore();

  const currentViewIds = filteredProjects.map((p) => p.id);
  const isAllChecked =
    currentViewIds.length > 0 &&
    currentViewIds.every((id) => selectedIds.includes(id));

  return (
    <div className="block md:hidden space-y-4">
      {/* Dynamic Mobile Master Toggle Bar */}
      {filteredProjects.length > 0 && (
        <div className="bg-card/20 border border-border p-3 flex items-center justify-between ">
          <label className="flex items-center gap-3 select-none cursor-pointer">
            <input
              type="checkbox"
              checked={isAllChecked}
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-primary rounded-none"
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              {isAllChecked ? "Deselect All Records" : "Select All Visible"}
            </span>
          </label>
          <span className="text-xs font-mono text-muted-foreground bg-black/20 px-2 py-0.5 border border-border">
            {selectedIds.length} Staged
          </span>
        </div>
      )}
      {filteredProjects.map((project) => {
        const isCardSelected = selectedIds.includes(project.id);
        return (
          <article
            key={project.id}
            className={`border transition-colors duration-150 p-4 flex flex-col gap-4 bg-card/10 ${
              isCardSelected
                ? "border-primary bg-[#11253e]/80"
                : "border-border"
            }`}
          >
            {/* Upper Context Block */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex gap-3">
                <img
                  src={project.imageUrl}
                  alt="project-imagge"
                  className="w-11 h-11 object-cover border border-border bg -black/20"
                />
                <div>
                  <h2 className="font-bold text-base text-foreground font-sans">
                    {project.title}
                  </h2>
                  <span className="text-[9px] font-mono font-bold tracking-wider text-muted-foreground uppercase block mt-0.5">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-black/10 px-2 py-1 border border-border">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-xs font-semibold text-foreground font-sans">
                  {project.publicAccess ? "public" : "private"}
                </span>
              </div>
            </div>

            {/* Middle Segment */}
            <p className="text-xs text-muted-foreground font-sans border-t border-border/40 pt-2">
              {project.subtitle}
            </p>

            {/* Interaction Utility Footer Row */}
            <div className="flex items-center justify-between border-t border-border/40 pt-3 mt-1">
              <label className="flex items-center gap-2 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCardSelected}
                  onChange={() => toggleSelectRow(project.id)}
                  className="w-4 h-4 accent-primary rounded-none"
                />
                <span className="text-xs text-muted-foreground font-mono">
                  Select
                </span>
              </label>

              <div className="flex items-center gap-4">
                <a
                  href={`/dashboard/projects/${project.id}/edit`}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-2"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </a>
                <button
                  onClick={() => deleteSingleProject(project.id)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors py-1 px-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// Tailwind CSS
//
// #block
//
