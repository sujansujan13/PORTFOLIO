"use client";

import { Edit3, Star, Trash2 } from "lucide-react";
import type { DashboardRow } from "@my-portfolio/api/schemas/project.schema";
import Image from "next/image";
import { useDeleteProject } from "@/hooks/useDashboardProjects";
import { toast } from "sonner";

export interface TableViewProps {
  projects: DashboardRow[];
  selectedIds: string[];
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
  isAllSelected: boolean;
}

export function ProjectTableView({
  projects,
  selectedIds,
  isAllSelected,
  onToggleRow,
  onToggleAll,
}: TableViewProps) {
  const deleteSingle = useDeleteProject();

  function deleteSingleProject(id: string) {
    deleteSingle.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Project Deleted SuccessFully");
          // router.push("/dashboard/projects");
        },
        onError: (error) => {
          toast.error(error.message || "Error updating project");
        },
      },
    );
  }

  return (
    <div className="hidden md:block w-full border border-border bg-card/20 rounded-lg overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-[#0a1829]/60  font-bold uppercase tracking-wider dark:text-muted-foreground text-white font-mono select-none">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onToggleAll}
                className="w-4 h-4 accent-primary rounded-none cursor-pointer"
              />
            </th>
            <th className="p-4 text-xs ">Project Info</th>
            <th className="p-4 text-xs ">Category</th>
            <th className="p-4 text-xs ">Status</th>
            <th className="p-4 text-xs  text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map((project) => {
            const isRowSelected = selectedIds.includes(project.id);
            return (
              <tr
                key={project.id}
                className={`transition-colors duration-150 group ${
                  isRowSelected ? "bg-[#11253e]" : "hover:bg-[#0f223a]/40"
                }`}
              >
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={isRowSelected}
                    onChange={() => onToggleRow(project.id)}
                    className="w-4 h-4 accent-primary rounded-none cursor-pointer"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={project.imageUrl as string}
                      alt=""
                      width={12}
                      height={12}
                      aria-hidden="true"
                      className="w-10 h-10 object-cover border border-border rounded-sm bg-black/20"
                      unoptimized
                    />
                    <div>
                      <h2 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors font-sans">
                        {project.title}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5 font-sans">
                        {project.subtitle}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-[10px] font-mono font-bold tracking-wider dark:bg-[#1d3557] dark:text-blue-400 px-2 py-1 rounded-sm border border-gray-700 uppercase">
                    {project.category}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border py-1 px-2 rounded-md ">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs text-olive-300 font-medium  font-mono">
                        {project.publicAccess === true ? "public" : "private"}
                      </span>
                    </div>
                    {project.featured && (
                      <div className="flex items-center gap-1 border py-1 px-2 rounded-md">
                        <Star className="w-2.5 h-2.5 fill-amber-400 stroke-amber-400" />
                        <span className="text-xs font-medium text-amber-400 font-sans">
                          {project.featured === true ? "featured" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    <a
                      href={`/dashboard/projects/${project.id}/edit`}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-none outline-none focus:ring-1 focus:ring-ring"
                      title="Edit Project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteSingleProject(project.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-none outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                      title="Delete Project"
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

// Tailwind CSS
//
// accent-primary
//
// divide-y divide-border
