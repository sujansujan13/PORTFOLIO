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
  defaultValues?: Partial<TimelineFormInput>;

  isEditing?: boolean;

  isSubmitting?: boolean;

  /**
   * Normal create/update submission.
   * This goes through React Hook Form + Zod validation.
   */
  onSubmit: (values: TimelineFormValues) => void | Promise<void>;

  /**
   * Save draft.
   *
   * The header does NOT receive the form values directly.
   * TimelineFormClient gets them from React Hook Form.
   */
  onSaveDraft?: (values: TimelineFormValues) => void | Promise<void>;
}

export default function TimelineFormClient({
  defaultValues,
  isEditing = false,
  isSubmitting = false,
  onSubmit,
  onSaveDraft,
}: TimelineFormClientProps) {
  const form = useForm<TimelineFormInput, unknown, TimelineFormValues>({
    resolver: zodResolver(timelineFormSchema),

    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = form;

  /**
   * Normal Create / Update
   *
   * handleSubmit performs Zod validation first.
   *
   * If valid:
   *   values -> onSubmit()
   *
   * If invalid:
   *   handleInvalid()
   */
  const handleFormSubmit = async (values: TimelineFormValues) => {
    await onSubmit(values);
  };

  /**
   * Save as Draft
   *
   * This is intentionally NOT passed directly to the header.
   *
   * Header only calls:
   *
   *     onSaveDraft()
   *
   * This function then gets the current form values and
   * passes them to the actual save-draft handler.
   */
  const handleSaveDraft = async () => {
    if (!onSaveDraft) {
      return;
    }

    await handleSubmit(async (values) => {
      await onSaveDraft(values);
    }, handleInvalid)();
  };

  /**
   * Discard changes.
   *
   * reset() with no argument resets to the original
   * defaultValues supplied when useForm() was created.
   */
  const handleDiscard = () => {
    reset();
  };

  /**
   * Called when normal form validation fails.
   *
   * Useful while debugging and can be removed later.
   */
  const handleInvalid = () => {
    console.log("Validation errors:", errors);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      <form
        id="timeline-form"
        onSubmit={handleSubmit(handleFormSubmit, handleInvalid)}
      >
        {/* Header Actions & Title */}
        <TimelineFormHeader
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onSaveDraft={!isEditing ? handleSaveDraft : undefined}
          onDiscard={isEditing ? handleDiscard : undefined}
        />

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <CoreDetailsSection form={form} errors={errors} />

            <DescriptionSection form={form} errors={errors} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-6">
            <TimlineVisibility register={form.register} />

            <MetadataSection form={form} errors={errors} />
          </div>
        </div>
      </form>
    </motion.main>
  );
}
