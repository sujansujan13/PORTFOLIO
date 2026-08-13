// @@@@@@@@@fullPage@@@@
"use client";

import React from "react";
import { TimelineCard } from "./timeline-card";
import type { TimelineItem } from "@/schemas/timeline.schema";

interface TimelineListProps {
  items: TimelineItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TimelineList({ items, onEdit, onDelete }: TimelineListProps) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center border border-dashed border-border p-8">
        <p className="text-muted-foreground text-sm">
          No timeline entries found. Click &quot;Add New Entry&quot; to get
          started.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Timeline items"
      className="relative flex flex-col gap-6 lg:pl-10"
    >
      {/* Large Screen Vertical Timeline Axis Line */}
      <div
        className="hidden lg:block absolute left-3.5 top-0 bottom-2 w-0.5 bg-border/80"
        aria-hidden="true"
      />

      {items.map((item) => {
        const isEducation = item.type === "education";

        return (
          <div key={item.id} className="relative group/timeline-node">
            {/* Desktop Timeline Connection Dot */}
            <div
              className={`hidden lg:block absolute -left-8 top-0 h-3.5 w-3.5 rounded-full border-2 border-background z-10 animate-pulse transition-transform duration-200 group-hover/timeline-node:scale-125 ${
                isEducation ? "bg-amber-500" : "bg-primary"
              }`}
              aria-hidden="true"
            />

            {/* Individual Card Component */}
            <TimelineCard item={item} onEdit={onEdit} onDelete={onDelete} />
          </div>
        );
      })}
    </section>
  );
}
