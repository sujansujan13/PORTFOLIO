"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProjectCard } from "../home/utils/project-card";

const PROJECTS_DATA = [
  {
    id: "fintrack",
    title: "FinTrack Pro",
    description:
      "A real-time financial monitoring system with automated expense categorization...",
    tags: ["MERN", "SOCKET.IO"],
    img: "/HomeImages/homeImage1.png",
  },
  {
    id: "electrohub",
    title: "ElectroHub",
    description:
      "Full-stack e-commerce solution with serverless functions, secure checkout, a...",
    tags: ["NEXT.JS", "STRIPE"],
    img: "/HomeImages/homeImage2.png",
  },
  {
    id: "agileflow",
    title: "AgileFlow",
    description:
      "Collaborative project management tool featuring drag-and-drop boards and real...",
    tags: ["NODE.JS", "REDIS"],
    img: "/HomeImages/homeImage3.png",
  },
];

export default function ProjectsSection() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveProjectId(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveProjectId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="projects"
      className="pt-20 pb-10 px-3 lg:px-12 bg-background w-full border-t border-[#444f62]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">
              Portfolio Highlights
            </p>
            <h2 className="text-3xl   font-semibold tracking-tight text-foreground">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold dark:text-white hover:text-primary transition-colors group border-2 border-[#673e0a] shadow-md rounded-3xl px-4 py-3 w-fit"
          >
            See all projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Responsive Flex/Grid Cards Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-4.5">
          {PROJECTS_DATA.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={activeProjectId === project.id}
              onCardClick={(e) => handleCardClick(project.id, e)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
