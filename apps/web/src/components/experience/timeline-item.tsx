"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";

interface TimelineCardProps {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
  bullets: string[];
  tags: string[];
  type: "experience" | "education";
  index: number;
}

// Micro-animations tuned for a mid-level implementation:
// Uses a controlled transform slide with a clean easeOut curve.
const itemVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function TimelineItem({
  role,
  company,
  location,
  period,
  description,
  bullets,
  tags,
  type,
  index,
}: TimelineCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={itemVariant}
      className={`relative flex flex-col md:flex-row w-full my-8 ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* 1. Spine Marker Desktop Position Engine */}
      <div className="absolute left-4 md:left-1/2 top-0 transform -translate-x-1/2 flex items-center justify-center z-10">
        <div className="p-2.5 bg-background border-2 border-primary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
          {type === "experience" ? (
            <Briefcase className="h-4 w-4" />
          ) : (
            <GraduationCap className="h-4 w-4" />
          )}
        </div>
      </div>

      {/* 2. Content Card Block Area */}
      <div
        className={`w-full md:w-[calc(50%-24px)] pl-12 md:pl-0 ${
          isEven ? "md:text-left md:pl-6" : "md:text-right md:pr-6"
        }`}
      >
        <div className="p-6 bg-card border border-border space-y-4 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 group">
          {/* Header Metadata Container */}
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              {period}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
              {role}
            </h3>

            <div
              className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium ${
                isEven ? "md:justify-start" : "md:justify-end"
              } justify-start`}
            >
              <span className="font-bold text-foreground/80">{company}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />
                {location}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Highlight Details Section */}
          <ul
            className={`space-y-1.5 text-xs text-muted-foreground/90 ${
              isEven ? "text-left" : "md:text-right text-left"
            } list-none`}
          >
            {bullets.map((bullet, idx) => (
              <li key={idx} className="leading-relaxed">
                • {bullet}
              </li>
            ))}
          </ul>

          {/* Dynamic Technical Pill Badge Layout */}
          <div
            className={`flex flex-wrap gap-1.5 pt-2 ${
              isEven ? "md:justify-start" : "md:justify-end"
            } justify-start`}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-tight bg-muted text-muted-foreground border border-border/60 hover:border-primary/40 hover:text-foreground transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
