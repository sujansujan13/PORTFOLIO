"use client";

import {
  useGetDashboardTimelineById,
  useUpdateTimeline,
} from "@/hooks/useTimeline";
import React from "react";
import TimelineFormClient from "../shared/timeline-form-Client";
import type { TimelineFormValues } from "@/schemas/timeline-form.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditClientPageProps {
  id: string;
}

export default function EditClientPage({ id }: EditClientPageProps) {
  const router = useRouter();

  // Fetch existing timeline entry
  const timelineQuery = useGetDashboardTimelineById(id);

  const {
    data: timeline,
    isPending: isLoadingTimeline,
    isError,
  } = timelineQuery;

  // Update mutation
  const updateTimeline = useUpdateTimeline();

  const handleSubmit = async (values: TimelineFormValues) => {
    if (!timeline) return;

    try {
      await updateTimeline.mutateAsync({
        id: timeline.id,
        data: {
          ...values,
          // Server-managed fields
          order: timeline.order,
          version: timeline.version,
        },
      });

      toast.success("Timeline updated successfully");

      router.push("/dashboard/timeline");
    } catch (error) {
      console.error("Failed to update timeline:", error);

      toast.error(
        error instanceof Error ? error.message : "Couldn't update timeline",
      );
    }
  };

  // Loading state
  if (isLoadingTimeline) {
    return <div>Loading timeline...</div>;
  }

  // Error state
  if (isError || !timeline) {
    return <div>Failed to load timeline.</div>;
  }

  return (
    <TimelineFormClient
      defaultValues={timeline}
      isEditing={true}
      isSubmitting={updateTimeline.isPending}
      onSubmit={handleSubmit}
    />
  );
}
