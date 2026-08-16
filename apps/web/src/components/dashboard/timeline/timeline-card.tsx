"use client";

import React from "react";
import {
  Briefcase,
  GraduationCap,
  Globe,
  Calendar,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import type { TimelineItem } from "@/schemas/timeline.schema";

interface TimelineCardProps {
  item: TimelineItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TimelineCard({ item, onEdit, onDelete }: TimelineCardProps) {
  const isEducation = item.type === "education";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group relative flex flex-col justify-between p-5 bg-card/60 backdrop-blur-sm border border-border/60 rounded-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${
        isEducation
          ? "border-t-2 border-t-amber-500/80"
          : "border-t-2 border-t-primary/80"
      }`}
    >
      <div>
        {/* Badges Container */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Type Badge */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${
              isEducation
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                : "bg-secondary text-secondary-foreground border border-border/50"
            }`}
          >
            {isEducation ? (
              <GraduationCap className="h-3.5 w-3.5" />
            ) : (
              <Briefcase className="h-3.5 w-3.5" />
            )}
            <span className="capitalize">{item.type}</span>
          </span>

          {/* Visibility Badge */}
          <span className="inline-flex items-center rounded-md gap-1.5 px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <Globe className="h-3.5 w-3.5" />
            <span>{item.publicAccess ? "Public" : "Private"}</span>
          </span>
        </div>

        {/* Content Title & Subtitle */}
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl group-hover:text-primary transition-colors">
          {item.role}
        </h2>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">
          {item.company}
        </p>

        {/* Metadata Grid */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>
              {item.startDate} - {item.endDate ? item.endDate : "Present"}
            </span>
          </div>
          {item.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{item.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex items-center gap-2 pt-2 border-t border-border/30 lg:border-t-0 lg:pt-0 lg:absolute lg:top-5 lg:right-5">
        <button
          onClick={() => onEdit?.(item.id)}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent border border-border/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer rounded-sm"
          aria-label={`Edit ${item.role}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete?.(item.id)}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer rounded-sm"
          aria-label={`Delete ${item.role}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}
