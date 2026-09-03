// components/dashboard/profile/LearningPathSection.tsx
"use client";

import React, { useState } from "react";
import { useFieldArray, type Control, useForm } from "react-hook-form";
import { Compass, Plus, Trash2, X } from "lucide-react";
import type { CompleteDashboardFormData } from "./profile-form";
import { Initials } from "@/lib/initials";

export interface GoalItem {
  id?: string;
  title: string;
  tag: string;
  description: string;
  progress: number;
  badgeText: string;
}

interface LearningPathProps {
  control: Control<CompleteDashboardFormData, any>;
}

export default function LearningPathSection({ control }: LearningPathProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "learningGoals",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  const goalForm = useForm<GoalItem>({
    defaultValues: {
      title: "",
      tag: "Deep Dive",
      description: "",
      progress: 0,
    },
  });

  const badgeText = Initials("title");

  const handleAddGoal = (data: GoalItem) => {
    append(data);
    goalForm.reset();
    setIsFormOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 rounded-md border border-border/80 bg-card space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2 text-foreground">
            <Compass className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Learning Roadmap</h2>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 rounded-md cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Goal
        </button>
      </div>

      {isFormOpen && (
        <div className="p-4 border border-primary/30 bg-card/80 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Add Learning Goal
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground uppercase text-[10px]">
                Topic Title
              </label>
              <input
                type="text"
                {...goalForm.register("title", { required: true })}
                placeholder="e.g. Rust / WASM"
                className="w-full bg-input/30 border border-border/80 px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-muted-foreground uppercase text-[10px]">
                Tag
              </label>
              <input
                type="text"
                {...goalForm.register("tag")}
                placeholder="e.g. Deep Dive"
                className="w-full bg-input/30 border border-border/80 px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground uppercase text-[10px]">
              Description
            </label>
            <textarea
              rows={2}
              {...goalForm.register("description")}
              placeholder="What are you learning specifically?"
              className="w-full bg-input/30 border border-border/80 px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-muted-foreground uppercase text-[10px]">
              Progress ({goalForm.watch("progress")}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              {...goalForm.register("progress", { valueAsNumber: true })}
              className="w-full accent-primary bg-input/40 h-1.5 rounded-md cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 bg-card border border-border/80 text-foreground hover:bg-accent rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={goalForm.handleSubmit(handleAddGoal)}
              className="px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-md cursor-pointer hover:opacity-90"
            >
              Save Goal
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => {
          const item = field as unknown as GoalItem;
          return (
            <div
              key={field.id}
              className="p-4 border border-dashed border-border/80 bg-card/40 space-y-3 relative group hover:border-primary/50 transition-colors rounded-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary/20 border border-primary/30 text-primary font-bold flex items-center justify-center text-xs">
                    {item.badgeText || item.title.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">
                      {item.title}
                    </h3>
                    <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-primary/10 text-primary border border-primary/20">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-primary font-bold">
                    {item.progress}%
                  </span>
                </div>
                <div className="w-full h-1 bg-input/40 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
