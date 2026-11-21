// import { useQuery } from "@tanstack/react-query";

import { trpc } from "@/utils/trpc";
import HeroSection from "@/components/home/hero-section";
import ProjectsSection from "@/components/home/project-section";
import { GitHubStatsSection } from "@/components/github/github-stats-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sujan Raj Pandey | Full-Stack Developer Portfolio",
  description:
    "Explore the portfolio of Sujan Raj Pandey, a Full-Stack developer specializing in highly interactive frontends, production-grade Node/Express backends, and scalable web architectures.",
  openGraph: {
    title: "Sujan Raj Pandey | Full-Stack Developer Portfolio",
    description:
      "Explore the portfolio of Sujan Raj Pandey, a Full-Stack developer specializing in highly interactive frontends, production-grade Node/Express backends, and scalable web architectures.",
    type: "website",
    url: "https://yourportfolio.com", // will replace with  production domain
  },
};

export default function Home() {
  return (
    <div className="container mx-auto max-w-8xl px-4">
      <HeroSection />
      <ProjectsSection />
      <GitHubStatsSection />
    </div>
  );
}
