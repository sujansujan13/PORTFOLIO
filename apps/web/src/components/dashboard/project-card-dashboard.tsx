// apps/web/components/dashboard/project-card.tsx
"use client";

import React from "react";
import { Edit2, Trash2, ArrowUpRight } from "lucide-react";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  category: string;
  techStack: string[];
}

export function ProjectCard({ project }: { project: any }) {
  const { openEditProjectModal } = useDashboardStore();

  const rawImage =
    project.thumbImageUrl ||
    project.heroImageUrl ||
    project.imageUrl;

  const imageSrc =
    typeof rawImage === "string" && rawImage.trim() !== ""
      ? rawImage
      : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60";

  const techStack: string[] = Array.isArray(project.techStack)
    ? project.techStack
    : Array.isArray(project.tags)
    ? project.tags
    : [];

  return (
    <div className="bg-card border border-border overflow-hidden rounded-lg flex flex-col justify-between hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video bg-muted overflow-hidden">
        <Image
          src={imageSrc}
          alt={project.title || "Project Image"}
          fill
          unoptimized={imageSrc.startsWith("http")}
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute bottom-3 left-3 bg-primary text-white text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-xs shadow-md">
          {project.category || "Project"}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between text-left">
        <div>
          <h4 className="font-bold text-base tracking-tight truncate">
            {project.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 min-h-8">
            {project.subtitle || project.description || ""}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                className="bg-muted text-foreground text-[10px] font-medium px-2 py-0.5 rounded-xs border border-border/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditProjectModal(project)}
              className="p-1.5 text-muted-foreground hover:text-primary border border-border hover:bg-muted/50 transition-all rounded-sm cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-destructive border border-border hover:bg-muted/50 transition-all rounded-sm cursor-pointer">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <button className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer">
            View Details <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
