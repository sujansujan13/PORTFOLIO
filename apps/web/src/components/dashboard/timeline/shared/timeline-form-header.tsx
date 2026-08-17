"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";
import type { Route } from "next";

interface TimelineFormHeaderProps {
  isEditing?: boolean;
  isSubmitting?: boolean;
  onDiscard?: () => void;
  onSaveDraft?: () => void;
}

export function TimelineFormHeader({
  isEditing = false,
  isSubmitting = false,
  onDiscard,
  onSaveDraft,
}: TimelineFormHeaderProps) {
  const handleSecondaryAction = () => {
    if (isEditing) {
      onDiscard?.();
    } else {
      onSaveDraft?.();
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={"/dashboard/timeline" as Route}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />

          <span>Back to Timeline</span>
        </Link>

        <div className="flex items-center gap-2.5">
          {/* Secondary action */}
          <button
            type="button"
            onClick={handleSecondaryAction}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground bg-card hover:bg-accent border border-border/80 rounded-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isEditing ? "Discard Changes" : "Save as Draft"}
          </button>

          {/* Primary action */}
          <button
            type="submit"
            form="timeline-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}

            <span>
              {isEditing ? "Update Entry" : "Create Entry"}
            </span>
          </button>
        </div>
      </div>

      <div>
        <motion.h1
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-black text-foreground tracking-tight"
        >
          {isEditing
            ? "Edit Timeline Entry"
            : "Add Experience Entry"}
        </motion.h1>

        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {isEditing
            ? "Update details and information for your professional history."
            : "Create a new timeline entry for your professional history or education."}
        </p>
      </div>
    </div>
  );
}