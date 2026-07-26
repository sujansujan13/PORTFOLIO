"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { ExternalLink, Layers } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import Image from "next/image";
import { THEMES, type ThemeType } from "@/config/color-theme";
import { type ProjectCard } from "@/schemas/project";

interface ProjectCardProps {
  initialProjects: ProjectCard;
}

// Clean fade-and-slide up variants tailored for mid-level developers
const cardAnimationVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

export function ProjectCard({ initialProjects }: ProjectCardProps) {
  const theme = THEMES[initialProjects.theme as ThemeType];
  return (
    <motion.article
      layout // Animates position re-ordering smoothly when filters change
      variants={cardAnimationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative flex flex-col w-full dark:bg-[#15263a] border border-border rounded-lg transition-all duration-300 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/2 will-change-transform"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg border-b border-border bg-muted">
        <div className="absolute inset-0 z-10 bg-neutral-950/5 dark:bg-neutral-950/20 pointer-events-none transition-opacity duration-300 group-hover:opacity-0" />

        <Image
          src={
            initialProjects.thumbImageUrl ||
            initialProjects.heroImageUrl ||
            "/ProjectsImages/projectsImage1.png"
          }
          alt={`${initialProjects.title} - ${initialProjects.subtitle}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Category Label Pin */}
        <span
          className={`absolute bottom-3 left-3 z-30 px-2.5  rounded-sm py-1 text-[10px] font-inter font-bold uppercase tracking-wider ${theme}  dark:text-foreground text-white backdrop-blur-xs`}
        >
          {initialProjects.category}
        </span>
      </div>

      {/* Narrative & Descriptive Content Box */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
            {initialProjects.title}
          </h3>
          <p className="text-xs font-medium text-primary/90 tracking-wide font-mono">
            {initialProjects.subtitle}
          </p>
        </div>

        <p className="text-sm text-foreground font-medium leading-relaxed flex-1">
          {initialProjects.description}
        </p>

        {/* Structural Tech Tags Cluster */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {initialProjects.techStack.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 text-[11px] font-mono font-bold text-muted-foreground bg-muted/60 border border-border/80 hover:border-primary/20 hover:text-foreground transition-colors duration-150"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Link Row */}
        <div className="flex items-center gap-4 pt-3 border-t dark:border-border/40 text-sm font-bold font-sans">
          {initialProjects.liveUrl && (
            <a
              href={initialProjects.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors duration-200"
              title={`Launch ${initialProjects.title} live preview`}
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demo</span>
            </a>
          )}
          {initialProjects.githubUrl && (
            <a
              href={initialProjects.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors duration-200 ml-auto"
              title={`Explore ${initialProjects.title} codebase`}
            >
              <FaGithub className="h-4 w-4" />
              <span>Source Code</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
