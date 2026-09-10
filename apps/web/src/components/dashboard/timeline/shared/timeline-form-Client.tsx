"use client";

import React, { useState } from "react";
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

import {
  formatToMonthInput,
  formatToDisplayDate,
} from "@/utils/date-formatter";
import { toast } from "sonner";

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
  const [resetkey, setResetkey] = useState<number>(0);
  const normalizedDefaultValues = React.useMemo(() => {
    if (!defaultValues) return undefined;
    return {
      ...defaultValues,
      startDate: formatToMonthInput(defaultValues.startDate),
      endDate: defaultValues.isPresent
        ? "present"
        : formatToMonthInput(defaultValues.endDate),
      bullets: Array.isArray(defaultValues.bullets)
        ? `<ul>${defaultValues.bullets.map((b) => `<li>${b.replace(/^[•\-\*]\s*/, "")}</li>`).join("")}</ul>`
        : (defaultValues.bullets ?? ""),
    };
  }, [defaultValues]);

  const form = useForm<TimelineFormInput, unknown, TimelineFormValues>({
    resolver: zodResolver(timelineFormSchema),

    defaultValues: normalizedDefaultValues,
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
    const formattedValues = {
      ...values,
      startDate: formatToDisplayDate(values.startDate),
      endDate: values.isPresent
        ? "present"
        : formatToDisplayDate(values.endDate),
    };
    await onSubmit(formattedValues);
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
      const formattedValues = {
        ...values,
        startDate: formatToDisplayDate(values.startDate),
        endDate: values.isPresent
          ? "present"
          : formatToDisplayDate(values.endDate),
      };
      await onSaveDraft(formattedValues);
    }, handleInvalid)();
  };

  /**
   * Discard changes.
   *
   * WHY THE BUG OCCURRED:
   * 1. Calling reset(defaultValues) reset the form to raw unformatted values
   *    (e.g. raw dates like "Mar 2026" instead of "2026-03", and raw array bullets instead of textarea string).
   *    HTML <input type="month"> rejects "Mar 2026", resulting in empty/blank fields on screen.
   * 2. Incrementing state resetkey had no effect because key={resetkey} was missing from the wrapper element.
   *
   * HOW TO FIX:
   * 1. Pass normalizedDefaultValues to reset() so dates stay in "YYYY-MM" format and bullets stay formatted for textarea.
   * 2. Attach key={resetkey} to <motion.main> to force React to unmount and remount input DOM elements with fresh reset values.
   */
  const handleDiscard = () => {
    reset(normalizedDefaultValues);
    setResetkey((prev) => prev + 1);
    toast.success("Changes Discarded");
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
      key={resetkey}
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
