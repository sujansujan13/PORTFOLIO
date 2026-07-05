import React from "react";
import { type Metadata } from "next";
import { ProjectGrid } from "@/components/projects/project-grid";

// Direct file structure imports for optimal build optimization
import projectData from "@/data/projects.json";

// --- RIGOROUS PRODUCTION SEO ROUTING METADATA ---
export const metadata: Metadata = {
  title: "Projects Portfolio | Sujan Raj Pandey",
  description:
    "Explore the technical software portfolio of Sujan Raj Pandey. Review full-stack Next.js applications, Express tRPC servers, and specialized GIS software toolsets.",
  openGraph: {
    title: "Projects Portfolio | Sujan Raj Pandey",
    description:
      "Production web builds and analytical software systems including the Himalayan Ripple framework and NepalExplore platforms.",
    type: "website",
  },
};

export default function ProjectsPage() {
  return (
    <main className="w-full min-h-screen bg-background text-foreground selection:bg-primary/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Core Page Context Intro Header */}
        <header className="space-y-4 text-left sm:text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1">
            Production Archives
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-none">
            Selected Work
          </h1>
          <p className="text-sm sm:text-base font-inter text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            A verified collection of production systems, decoupled APIs, and
            interface designs leveraging current structural engineering methods.
          </p>
        </header>

        {/* Interactive Dynamic Filtering Engine Section */}
        <ProjectGrid
          initialProjects={projectData.projects}
          categories={projectData.categories}
        />
      </div>
    </main>
  );
}
