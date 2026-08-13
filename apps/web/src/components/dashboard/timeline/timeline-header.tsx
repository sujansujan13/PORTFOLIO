"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Route } from "next";

// Wrap Next.js Link with Framer Motion
const MotionLink = motion.create(Link);

interface TimelineHeaderProps {
  href?: string;
}

export function TimelineHeader({
  href = "/timeline/new",
}: TimelineHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Experience &amp; Education
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your professional timeline entries.
        </p>
      </div>

      <MotionLink
        href={href as Route}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold text-sm px-4 py-2.5 rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto cursor-pointer group"
        aria-label="Add new timeline entry"
      >
        <Plus className="h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:rotate-90" />
        <span>Add New Entry</span>
      </MotionLink>
    </header>
  );
}
