import React from "react";
import { type Metadata } from "next";

import TimelineClient from "@/components/experience/timeline-client";

// --- STRUCTURED SEO DEFINITIONS ---
export const metadata: Metadata = {
  title: "Experience & Education | Sujan Raj Pandey",
  description:
    "Explore the professional timeline, software internships, advanced engineering database labs, and full-stack development history of Sujan Raj Pandey.",
  openGraph: {
    title: "Experience & Education | Sujan Raj Pandey",
    description:
      "Full-stack development timeline, including the Himalayan Ripple framework design and Tribhuvan University engineering academic milestones.",
    type: "profile",
  },
};

export default function ExperienceEducationPage() {
  return (
    <main className="w-full min-h-screen bg-background text-foreground selection:bg-primary/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-28">
        {/* Core Introductory Hero Info Block */}
        <header className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1">
            Pathways & Foundations
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-foreground">
            Journey & Background
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Bridging conceptual database design with full-stack software
            production workflows. Here is the summary of my technical
            internships and formal academic tracks.
          </p>
        </header>
        <TimelineClient />
      </div>
    </main>
  );
}
