"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import type { Route } from "next";

interface ProjectSidebarProps {
  role: string;
  timeline: string;
  toolsUsed: string[];
  caseStudyPdfUrl?: string;
}

export function ProjectSidebar({
  role,
  timeline,
  toolsUsed,
  caseStudyPdfUrl,
}: ProjectSidebarProps) {
  return (
    <aside className="bg-card/40 border border-border/80 rounded-xl p-6 space-y-6 h-fit sticky top-24">
      {/* Role */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Role
        </h4>
        <p className="text-sm font-bold text-foreground">{role}</p>
      </div>

      {/* Timeline */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Timeline
        </h4>
        <p className="text-sm font-bold text-foreground">{timeline}</p>
      </div>

      {/* Tools Used */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Tools Used
        </h4>
        <ul className="space-y-1">
          {toolsUsed.map((tool) => (
            <li
              key={tool}
              className="text-sm font-medium text-muted-foreground"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>

      {/* PDF Action Callout */}
      {caseStudyPdfUrl && (
        <div className="pt-4 border-t border-border/60 text-center space-y-3">
          <p className="text-xs italic text-muted-foreground">
            Interested in the results?
          </p>
          <Link
            href={caseStudyPdfUrl as Route}
            target="_blank"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-foreground bg-background hover:bg-secondary border border-border rounded-md transition-colors"
          >
            Download Full Case Study <Download className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </aside>
  );
}
