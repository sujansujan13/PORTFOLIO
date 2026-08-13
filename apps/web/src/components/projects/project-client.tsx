"use client";

import { usePublicProjects } from "@/hooks/usePublicProjects";
import { useMemo } from "react";
import type { ProjectCard } from "@/schemas/project";
import { ProjectGrid } from "./project-grid";

const categories = [
  { slug: "all", label: "All Builds" },
  { slug: "fullstack", label: "Full-Stack" },
  { slug: "frontend", label: "Frontend & UI" },
  { slug: "gis", label: "Spatial & GIS" },
];

const themeByCategory: Record<string, string> = {
  fullstack: "blue",
  frontend: "rose",
  gis: "amber",
};

export function ProjectsClient() {
  const projectsQuery = usePublicProjects({ limit: 50 });
  const projects = useMemo<ProjectCard[]>(() => {
    return (
      projectsQuery.data?.map((project) => ({
        id: project.id,
        title: project.title,
        subtitle: project.subtitle,
        customSlug: project.customSlug,
        description: project.description,
        category: project.category,
        heroImageUrl: project.heroImageUrl,
        thumbImageUrl: project.thumbImageUrl,
        techStack: project.techStack,
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        theme: themeByCategory[project.category] ?? "blue",
      })) ?? []
    );
  }, [projectsQuery.data]);

  if (projectsQuery.isPending) {
    return <p>Loading projects...</p>;
  }

  if (projectsQuery.isError) {
    return <p>Could not load projects.</p>;
  }

  return <ProjectGrid projects={projects} categories={categories} />;
}
