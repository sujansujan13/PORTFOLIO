"use client";

import Image from "next/image";
import projectsData from "@/data/project-details.json";
import { ProjectHero } from "@/components/projects/details-page/project-hero";
import { ProjectMetrics } from "@/components/projects/details-page/project-metrics";
import { ProjectSidebar } from "@/components/projects/details-page/project-sideBar";
import { ProjectFeatures } from "@/components/projects/details-page/project-feature";
import { NextProjectCard } from "@/components/projects/details-page/next-project-card";
import { TiptapRenderer } from "@/components/blog/blog-dynamic/tiptap-renderer";
import type { TiptapJson } from "@my-portfolio/api/schemas/blog.schema";
import { useProjectBySlug } from "@/hooks/useProjectBySlug";
import { p } from "framer-motion/client";

export default function DynamicProjectClient({ slug }: { slug: string }) {
  const projectQuery = useProjectBySlug(slug);
  const { isPending, isError } = projectQuery;
  if (isPending) {
    return <p>Loading Project</p>;
  }
  if (isError) {
    return <p>Projeect Not Fetched/Found</p>;
  }

  const project = projectQuery.data;
  // // Find project matching the custom slug fallback to first record
  // const project =
  //   projectsData.find((p) => p.customSlug === slug) ?? projectsData[0];

  return (
    <article className="min-h-screen bg-background text-foreground max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 1. HERO SECTION */}
      <ProjectHero
        title={project.title}
        subtitle={project.subtitle}
        description={project.description}
        techStack={project.techStack}
        heroImageUrl={project.heroImageUrl}
        githubUrl={project.githubUrl}
        liveUrl={project.liveUrl}
      />

      {/* 2. STATS & METRICS DISPLAY */}
      <ProjectMetrics metrics={project.metrics} />

      {/* 3. MAIN CONTENT GRID (Body Content + Sidebar Metadata) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-10">
        {/* Left Column: Rich Text Case Study & Features */}
        <div className="lg:col-span-8 space-y-8">
          <TiptapRenderer content={project.body as unknown as TiptapJson} />

          {/* Gallery Showcase Grid */}
          {/* {project.galleryImages && project.galleryImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {project.galleryImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-lg overflow-hidden border border-border"
                >
                  <Image
                    src={imgUrl}
                    alt={`Screenshot ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )} */}

          {/* Key Features Bento Grid */}
          <ProjectFeatures features={project.features} />
        </div>

        {/* Right Column: Sticky Project Details Sidebar */}
        <div className="lg:col-span-4">
          <ProjectSidebar
            role={project.role}
            timeline={project.timeline}
            toolsUsed={project.toolsUsed}
            caseStudyPdfUrl={project.caseStudyPdfUrl}
          />
        </div>
      </div>

      {/* 4. NEXT PROJECT LINK */}
      {project.relatedProject && (
        <NextProjectCard nextProject={project.relatedProject} />
      )}
    </article>
  );
}
