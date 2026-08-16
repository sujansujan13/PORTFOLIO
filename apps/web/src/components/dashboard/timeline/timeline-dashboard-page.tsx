"use client";

import React, { useState } from "react";
import { TimelineHeader } from "./timeline-header";
import { TimelineList } from "./timeline-list";
import { TimelineFooter } from "./timeline-footer";
import type { TimelineItem } from "@/schemas/timeline.schema";
import TimelineSearchFilter from "./timeline-search-filter";
import { useDashboardTimeline } from "@/hooks/useTimeline";

export default function TimelineDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [type, setType] = useState<"all" | "education" | "experience">("all");

  const dashboardTimelineQuery = useDashboardTimeline({
    search: searchQuery,
    type,
  });

  const { isPending, isError } = dashboardTimelineQuery;

  const timeline = dashboardTimelineQuery.data?.items || [];
  const counts = dashboardTimelineQuery.data?.counts;

  const items = timeline;

  const handleEdit = (id: string) => {
    console.log("Edit entry:", id);
  };

  const handleDelete = (id: string) => {};

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleTypeChange = (type: "all" | "education" | "experience") => {
    setType(type);
  };

  const nodeCounts = {
    all: counts?.all,
    experience: counts?.experience,
    education: counts?.education,
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
      />

      {/* Main Timeline Content */}
      <TimelineList
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isPending={isPending}
        isError={isError}
      />

      {/* Page Footer */}
      <TimelineFooter />
    </main>
  );
}
