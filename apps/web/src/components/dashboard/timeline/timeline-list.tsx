// @@@@@@@@@fullPage@@@@
"use client";

import React from "react";
import { TimelineCard } from "./timeline-card";
import type { TimelineItem } from "@/schemas/timeline.schema";

interface TimelineListProps {
  items: TimelineItem[];
  onDelete?: (id: string) => void;
  isPending: boolean;
  isError: boolean;
}

export function TimelineList({
  items,

  onDelete,
  isPending: isLoading = false,
  isError,
}: TimelineListProps) {
  return (
    <section
      aria-label="Timeline items"
      className="relative flex flex-col gap-6 lg:pl-10"
    >
      {isLoading ? (
        <div className="space-y-4 w-full py-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="relative rounded-xl bg-card/50 border border-border/60 p-5 space-y-3 animate-pulse"
            >
              {/* Skeleton Badges */}
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-muted/60 rounded-md" />
                <div className="h-5 w-16 bg-muted/40 rounded-md" />
              </div>

              {/* Skeleton Title & Subtitle */}
              <div className="space-y-2 pt-1">
                <div className="h-5 w-2/3 bg-muted/80 rounded" />
                <div className="h-4 w-1/3 bg-muted/50 rounded" />
              </div>

              {/* Skeleton Meta */}
              <div className="flex gap-4 pt-2">
                <div className="h-3 w-24 bg-muted/40 rounded" />
                <div className="h-3 w-32 bg-muted/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="text-destructive">Failed to load timeline entries.</p>
      ) : items.length > 0 ? (
        <>
          <div
            className="hidden lg:block absolute left-3.5 top-0 bottom-2 w-0.5 bg-border/80"
            aria-hidden="true"
          />

          {items.map((item) => {
            const isEducation = item.type === "education";

            return (
              <div key={item.id} className="relative group/timeline-node">
                <div
                  className={`hidden lg:block absolute -left-8 top-0 h-3.5 w-3.5 rounded-full border-2 border-background z-10 transition-transform duration-200 group-hover/timeline-node:scale-125 ${
                    isEducation ? "bg-amber-500" : "bg-primary"
                  }`}
                  aria-hidden="true"
                />

                <TimelineCard item={item} onDelete={onDelete} />
              </div>
            );
          })}
        </>
      ) : (
        <div className="py-12 text-center border border-dashed border-border p-8">
          <p className="text-muted-foreground text-sm">
            No timeline entries found. Click &quot;Add New Entry&quot; to get
            started.
          </p>
        </div>
      )}
    </section>
  );
}
