"use client";
import React from "react";
import { TimelineSection } from "@/components/experience/timeline-section";

import { useTimeline } from "@/hooks/useTimeline";

export default function TimelineClient() {
  const TimelineQuery = useTimeline({ limit: 10 });

  const { isPending, isError } = TimelineQuery;

  if (isPending) {
    return <p>Loading Timeline Data ...</p>;
  }

  if (isError) {
    return <p>Error Fetching Timeline Data</p>;
  }

  const data = TimelineQuery.data;
  return (
    <>
      {/* SECTION 1: PROFESSIONAL TRACKS */}
      <TimelineSection
        title="Professional Journey"
        subtitle="Software history, technical internships, and architectural roles."
        // actual data passed
        items={data.experience}
        type="experience"
      />

      {/* SECTION 2: ACADEMIC MILESTONES */}
      <TimelineSection
        title="Academic Milestones"
        subtitle="Formal computing foundations, core database labs, and specialized modules."
        items={data.education}
        type="education"
      />
    </>
  );
}
