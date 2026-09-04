"use client";

import { usePublicProjects } from "@/hooks/usePublicProjects";
import { useMemo } from "react";
import type { ProjectCard } from "@/schemas/project";
import { ProjectGrid } from "./project-grid";
import { useGetCategories } from "@/hooks/useCategory";

export function ProjectsClient() {
  const categoriesQuery = useGetCategories({ type: "project" });
  const projectsQuery = usePublicProjects({ limit: 50 });

  // 1. Format categories array for ProjectGrid ({ slug, label }) with "All Builds" default tab
  const categories = useMemo(() => {
    const rawCategories = categoriesQuery.data || [];
    const formatted = rawCategories.map((cat) => ({
      slug: cat.slug,
      label: cat.name,
    }));

    return [{ slug: "all", label: "All Builds" }, ...formatted];
  }, [categoriesQuery.data]);

  // 2. Map category slug to badge color dynamically from database
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoriesQuery.data?.forEach((cat) => {
      map[cat.slug] = cat.color || "blue";
    });
    return map;
  }, [categoriesQuery.data]);

  // 3. Serialize public projects with dynamic category theme colors
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
        theme: categoryColorMap[project.category] ?? "blue",
      })) ?? []
    );
  }, [projectsQuery.data, categoryColorMap]);

  if (projectsQuery.isPending || categoriesQuery.isPending) {
    return (
      <p className="text-center py-12 text-sm text-muted-foreground">
        Loading projects...
      </p>
    );
  }

  if (projectsQuery.isError || categoriesQuery.isError) {
    return (
      <p className="text-center py-12 text-sm text-red-500 font-medium">
        Could not load projects.
      </p>
    );
  }

  return <ProjectGrid projects={projects} categories={categories} />;
}
