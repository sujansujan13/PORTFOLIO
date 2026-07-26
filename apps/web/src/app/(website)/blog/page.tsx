import React from "react";
import type { Metadata } from "next";
import Blogclient from "@/components/blog/blog-client";

// --- STRUCTURED SEARCH LOGISTIC ENGINE INGESTION METADATA ---
export const metadata: Metadata = {
  title: "Insights & Technical Writing | DevPortfolio",
  description:
    "A professional collection of technical deep-dives covering React state management patterns, system architecture principles, Node.js microservices, and modern DevOps tooling pipelines.",
  openGraph: {
    title: "Insights & Technical Writing | DevPortfolio",
    description:
      "Explore advanced design pattern architectures and full-stack software system mechanics written for senior engineers and development teams.",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <main className="w-full min-h-screen bg-background text-foreground selection:bg-primary/20 py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Structural Central Content Boundary Alignment Container */}
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Core Entry Narrative Typography Header Area Component Block */}
        <header className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-none">
            Insights & Technical Writing
          </h1>
          <p className="text-base text-accent-foreground leading-relaxed font-medium">
            A collection of articles on full-stack development, system
            architecture, and modern web technologies.
          </p>
        </header>

        <Blogclient />
      </div>
    </main>
  );
}
