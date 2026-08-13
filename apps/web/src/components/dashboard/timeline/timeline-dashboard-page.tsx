"use client";

import React, { useState } from "react";
import { TimelineHeader } from "./timeline-header";
import { TimelineList } from "./timeline-list";
import { TimelineFooter } from "./timeline-footer";
import type { TimelineItem } from "@/schemas/timeline.schema";
import TimelineSearchFilter from "./timeline-search-filter";

// Default mockup data matching your project domain
const INITIAL_DATA: TimelineItem[] = [
  {
    id: "1",
    role: "Lead Full-Stack Developer",
    company: "Himalayan Ripple Project",
    location: "Kathmandu, Nepal (Hybrid)",
    period: "Mar 2026 - Present",
    type: "experience",
    isPublic: true,
  },
  {
    id: "2",
    role: "Software Engineer",
    company: "NepalExplore Platform",
    location: "Remote",
    period: "Jan 2024 - Feb 2026",
    type: "experience",
    isPublic: true,
  },
  {
    id: "3",
    role: "B.Sc. Computer Science & IT",
    company: "Tribhuvan University",
    location: "Kathmandu, Nepal",
    period: "Nov 2019 - Dec 2023",
    type: "education",
    isPublic: true,
  },
];

export default function TimelineDashboardPage() {
  const [items, setItems] = useState<TimelineItem[]>(INITIAL_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState<"all" | "education" | "experience">("all");
  const [isloading, setIsloading] = useState(false);

  const handleEdit = (id: string) => {
    console.log("Edit entry:", id);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleTypeChange = (type: "all" | "education" | "experience") => {
    setType(type);
  };

  const nodeCounts = {
    all: items.length,
    experience: items.filter((item) => item.type === "experience").length,
    education: items.filter((item) => item.type === "education").length,
  };

  return (
    <main className="w-full min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto">
      {/* Page Header */}
      <TimelineHeader href="/dashboard/timeline/new" />

      {/* Searching and filtering */}
      <TimelineSearchFilter
        search={searchQuery}
        onSearchChange={handleSearchChange}
        type={type}
        onTypeChange={handleTypeChange}
        counts={nodeCounts}
        isLoading={isloading}
      />

      {/* Main Timeline Content */}
      <TimelineList items={items} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Page Footer */}
      <TimelineFooter />
    </main>
  );
}
