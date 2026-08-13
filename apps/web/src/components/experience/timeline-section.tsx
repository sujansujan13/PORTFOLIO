"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { TimelineItem } from "./timeline-item";

interface TimelineData {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  description: string;
  bullets: string[];
  tags: string[];
}

interface TimelineSectionProps {
  title: string;
  subtitle: string;
  items: TimelineData[];
  type: "experience" | "education";
}

// Triggers consecutive card delays on scroll view intersections
const containerStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export function TimelineSection({
  title,
  subtitle,
  items,
  type,
}: TimelineSectionProps) {
  return (
    <section className="space-y-12">
      {/* Section Text Layout */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Structural Spine Layout Component */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={containerStagger}
        className="relative w-full max-w-5xl mx-auto before:absolute before:top-0 before:bottom-0 before:left-4 md:before:left-1/2 before:w-[1.5px] before:bg-border/60"
      >
        {items.map((item, idx) => (
          <TimelineItem key={item.id} {...item} type={type} index={idx} />
        ))}
      </motion.div>
    </section>
  );
}
