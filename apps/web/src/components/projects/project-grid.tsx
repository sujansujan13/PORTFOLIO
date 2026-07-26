"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ProjectCard } from "./project-card";
import type { ProjectCard as ProjectCardType } from "@/schemas/project";

interface Category {
  slug: string;
  label: string;
}

interface ProjectGridProps {
  initialProjects: ProjectCardType[];
  categories: Category[];
}

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export function ProjectGrid({ initialProjects, categories }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProjects = initialProjects.filter(
    (project) =>
      activeCategory === "all" || project.category === activeCategory,
  );

  return (
    <div className="space-y-12">
      {/* Category Navigation Segment Bar */}
      <div className="flex flex-wrap justify-start sm:justify-center items-center gap-2 border-b border-border/40 pb-5">
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => setActiveCategory(category.slug)}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-lg uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
              activeCategory === category.slug
                ? "bg-[#1f40af] text-primary-foreground border-primary shadow-sm"
                : "bg-card/40 text-muted-foreground border-border hover:border-muted-foreground/40 hover:text-foreground"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Grid Canvas Wrapper */}
      <motion.div
        layout
        variants={gridContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {/* mode={popLayout} When items are removed, surrounding items smoothly animate to fill gaps */}
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} initialProjects={project} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty Fallback State Layout */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-border"
        >
          <p className="text-sm text-muted-foreground">
            No production builds currently assigned to this technical category.
          </p>
        </motion.div>
      )}
    </div>
  );
}
