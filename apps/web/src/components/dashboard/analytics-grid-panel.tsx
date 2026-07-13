// apps/web/components/dashboard/analytics-grid-panel.tsx
"use client";

import React from "react";
import { IconRenderer } from "@/components/about/icon-renderer";

interface StatItem {
  id: string;
  label: string;
  iconName: string;
  accentColor: string;
  value: string | number;
  changeText: string;
}

export function AnalyticsGridPanel({ statsData }: { statsData: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className="p-5 bg-card border border-border rounded-lg flex flex-col justify-between group hover:border-primary/30 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
            <div className="p-2 bg-muted rounded-sm group-hover:bg-muted/80 transition-colors">
              <IconRenderer
                name={stat.iconName}
                className={`h-4 w-4 ${stat.accentColor}`}
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-3xl font-extrabold tracking-tight font-mono">
              {stat.value}
            </h3>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 font-medium">
              {stat.id === "projects" && (
                <span className="text-emerald-500">↗</span>
              )}
              {stat.id === "messages" && (
                <span className="text-destructive">⚠️</span>
              )}
              {stat.changeText}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
