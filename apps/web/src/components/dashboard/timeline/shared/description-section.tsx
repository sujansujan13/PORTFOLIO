"use client";

import React, { useRef } from "react";
import { FileText, List, CornerDownLeft } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type {
  TimelineFormInput,
  TimelineFormValues,
} from "./../../../../schemas/timeline-form.schema";
import TextareaField from "./../../forms/textarea-field";

interface DescriptionSectionProps {
  form: UseFormReturn<TimelineFormInput>;
  maxLength?: number;
}

export function DescriptionSection({
  form,
  maxLength = 1000,
}: DescriptionSectionProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const descriptionValue = watch("description") || "";
  const charCount = descriptionValue.length;

  /**
   * Directly inserts bullet point at cursor location
   */
  const handleInsertBullet = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;

    const needsNewLine = start > 0 && currentText[start - 1] !== "\n";
    const bulletText = needsNewLine ? "\n• " : "• ";

    const updatedText =
      currentText.substring(0, start) + bulletText + currentText.substring(end);

    setValue("description", updatedText, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + bulletText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  /**
   * Automatically adds '• ' on Enter if the current line starts with a bullet point
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentText = textarea.value;

    // Get line text before cursor
    const lastNewLineIndex = currentText.lastIndexOf("\n", start - 1);
    const currentLine = currentText.substring(lastNewLineIndex + 1, start);

    // If current line starts with a bullet symbol or dash
    if (/^[•\-\*]\s/.test(currentLine)) {
      e.preventDefault(); // Stop default Enter action

      // If user presses enter on an empty bullet line, clean it up (stop bullet list)
      if (currentLine.trim() === "•" || currentLine.trim() === "-") {
        const updatedText =
          currentText.substring(0, lastNewLineIndex + 1) +
          currentText.substring(start);

        setValue("description", updatedText, {
          shouldValidate: true,
          shouldDirty: true,
        });
        return;
      }

      // Add a newline followed by the bullet symbol
      const bulletInsert = "\n• ";
      const updatedText =
        currentText.substring(0, start) +
        bulletInsert +
        currentText.substring(start);

      setValue("description", updatedText, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Move cursor after the bullet on the new line
      setTimeout(() => {
        textarea.setSelectionRange(
          start + bulletInsert.length,
          start + bulletInsert.length,
        );
      }, 0);
    }
  };

  const { ref: registerRef, ...descriptionRegistration } =
    register("description");

  return (
    <section className="group bg-card border border-border/80 rounded-lg p-4 sm:p-5 space-y-4 shadow-sm transition-all duration-200 hover:border-border">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <FileText className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground leading-none">
              Description
            </h2>
            <p className="text-[11px] text-muted-foreground mt-1">
              Add key achievements and details using line breaks or bullet
              points.
            </p>
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex items-center gap-1.5 bg-input/20 border border-border/70 p-1 rounded-md">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInsertBullet}
            className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded transition-colors cursor-pointer"
            title="Insert Bullet Point (•)"
          >
            <List className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Add Bullet</span>
          </button>
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="relative space-y-2">
        <TextareaField
          label=""
          rows={6}
          placeholder={`• Built responsive dashboard UI using Next.js & Tailwind CSS\n• Integrated MongoDB with Mongoose aggregation pipelines\n• Improved page performance score by 35%`}
          registration={{
            ...descriptionRegistration,
            ref: (e) => {
              registerRef(e);
              textareaRef.current = e;
            },
          }}
          onKeyDown={handleKeyDown}
          error={errors.description?.message}
          className="font-mono text-xs leading-relaxed resize-y min-h-[140px] focus:ring-1 focus:ring-primary/40"
        />

        {/* Footer Bar */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CornerDownLeft className="w-3 h-3 text-muted-foreground/70 shrink-0" />
            <span>
              Press{" "}
              <kbd className="px-1 py-0.5 text-[10px] bg-muted border border-border rounded font-mono">
                Enter
              </kbd>{" "}
              to continue bullet list
            </span>
          </div>

          <div
            className={`font-mono transition-colors ${
              charCount > maxLength
                ? "text-destructive font-bold"
                : "text-muted-foreground/80"
            }`}
          >
            {charCount}/{maxLength}
          </div>
        </div>
      </div>
    </section>
  );
}
