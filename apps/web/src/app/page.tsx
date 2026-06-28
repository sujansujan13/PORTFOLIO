"use client";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";
import HeroSection from "@/components/home/hero-section";
import ProjectsSection from "@/components/home/project-section";

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <div className="container mx-auto max-w-8xl px-4  ">
      <HeroSection />
      <ProjectsSection />
      {/* <section className="rounded-lg border p-4">
        <h2 className="mb-2 font-medium">API Status</h2>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-sm text-muted-foreground">
            {healthCheck.isLoading
              ? "Checking..."
              : healthCheck.data
                ? "Connected"
                : "Disconnected"}
          </span>
        </div>
      </section> */}
    </div>
  );
}
