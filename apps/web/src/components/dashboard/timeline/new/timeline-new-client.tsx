"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TimelineFormClient from "./../shared/timeline-form-Client";
import type { TimelineFormValues } from "./../../../../schemas/timeline-form.schema";
import type { Route } from "next";
import { useCreateTimline } from "@/hooks/useTimeline";
import { toast } from "sonner";

export default function TimelineNewClient() {
  const router = useRouter();
  const createTimeline = useCreateTimline();

  const handleCreate = (data: TimelineFormValues) => {
    createTimeline.mutate(data, {
      onSuccess: () => {
        toast.success("Timeline Node Created SuccessFully");
        router.push("/dashboard/timeline");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create timeline node");
      },
    });
  };

  return <TimelineFormClient isEditing={false} onSubmit={handleCreate} />;
}
