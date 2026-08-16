"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  timelineFormSchema,
  type TimelineFormInput,
  type TimelineFormValues,
} from "./../../../../schemas/timeline-form.schema";
import { TimelineFormHeader } from "./timeline-form-header";
import { CoreDetailsSection } from "./core-details-section";
import { DescriptionSection } from "./description-section";
import { MetadataSection } from "./metadata-section";
import TimlineVisibility from "./timeline-visibilty";

interface TimelineFormClientProps {
  initialData?: Partial<TimelineFormInput>;
  isEditing?: boolean;
  onSubmit: (values: TimelineFormValues) => void | Promise<void>;
}
export default function TimelineFormClient({
  initialData,
  isEditing = false,
  onSubmit,
}: TimelineFormClientProps) {
  const form = useForm<TimelineFormInput, unknown, TimelineFormValues>({
    resolver: zodResolver(timelineFormSchema),
    defaultValues: {
      role: initialData?.role ?? "",
      company: initialData?.company ?? "",
      location: initialData?.location ?? "",
      startDate: initialData?.startDate ?? "",
      endDate: initialData?.endDate ?? "",
      isPresent: initialData?.isPresent ?? false,
      description: initialData?.description ?? "",
      type: initialData?.type ?? "experience",
      publicAccess: initialData?.publicAccess ?? true,
      tags: initialData?.tags ?? [],
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const handleFormSubmit = async (values: TimelineFormValues) => {
    try {
      await onSubmit(values);
    } catch (err) {
      console.error("Failed to submit timeline entry:", err);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Header Actions & Title */}
        <TimelineFormHeader
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onDiscard={() => reset()}
        />

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Core Details + Description) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <CoreDetailsSection form={form} />
            <DescriptionSection form={form} />
          </div>

          {/* Right Column (Metadata Sidebar) */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-6">
            <TimlineVisibility register={form.register} />
            <MetadataSection form={form} />
          </div>
        </div>
      </form>
    </motion.main>
  );
}
