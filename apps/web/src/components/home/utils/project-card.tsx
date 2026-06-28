"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  img: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isActive: boolean; // Managed by parent
  onCardClick: (e: React.MouseEvent) => void; // Passed from parent
}

export function ProjectCard({
  project,
  index,
  isActive,
  onCardClick,
}: ProjectCardProps) {
  // State to manage mobile tap visibility
  const [isMobTapped, setIsMobTapped] = useState<boolean>(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      // onClick event trigger for mobiles and all
      onClick={onCardClick}
      className="group relative flex flex-col rounded-lg dark:border border-[#455365] bg-background overflow-hidden transition-all duration-300 shadow-lg dark:hover:border-primary/30 dark:hover:shadow-lg dark:hover:shadow-primary/5 space-y-2"
    >
      {/* Aspect Ratio Controlled Thumbnail Container */}
      <div className="relative aspect-16/11 w-full bg-muted/30 overflow-hidden border-b border-border/50 ">
        {/* 
  Gradient overlay to improve text/button readability.
  - Dark mode: subtle black gradient for better contrast.
  - Light mode: very light transparent overlay to avoid washing out the image.
*/}
        <div className="absolute inset-0 z-10 bg-linear-to-t from-white/10 via-transparent to-transparent dark:from-black/40" />
        {/* Visual Placeholder mimicking mockups */}
        <Image
          src={project.img}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw,33vw"
          className="overflow-hidden object-cover group-hover:scale-105 duration-300 transition-all ease-in-out "
        />
        <div
          className={cn(
            "absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10",
            isActive && "opacity-100",
          )}
        >
          <span className="bg-white text-blue-900  px-4 py-2 rounded-full font-semibold  text-sm shadow-lg ">
            View Case Study
          </span>
        </div>
      </div>

      {/* Card Meta Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-[#d2e4fe] dark:bg-secondary  text-[#00288E] dark:text-secondary-foreground border border-border/80 "
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-4 md:space-y-3 flex-1">
          <h3 className="text-2xl  font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-relaxed">
            {project.title}
          </h3>
          <p className="text-base dark:text-gray-200 font-medium leading-relaxed md:line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
