// components/dashboard/profile/TechnicalArsenalSection.tsx
"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, type Control } from "react-hook-form";
import {
  Layers,
  Plus,
  X,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Star,
  Info,
} from "lucide-react";
import type { CompleteDashboardFormData } from "./profile-form";
import { Initials } from "../../../lib/initials";
import { useGetCategories } from "@/hooks/useCategory";
import Link from "next/link";
import type { Route } from "next";

export interface SkillItem {
  id?: string;
  name: string;
  category: string;
  subtitle: string;
  proficiency: number;
  isCore: boolean;
  isVisible: boolean;
  badgeText: string;
}

export interface SkillFormValues {
  skills: SkillItem[];
}

interface TechnicalArsenalProps {
  control: Control<CompleteDashboardFormData, any>;
}

export default function TechnicalArsenalSection({
  control,
}: TechnicalArsenalProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "skills",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  const categoriesQuery = useGetCategories({ type: "skill" });

  const categories = categoriesQuery.data || [];

  const isCategoriesLoading = categoriesQuery.isPending;

  const isCategoriesError = categoriesQuery.isError;

  // Dynamic Skill Creation Local Form
  const skillForm = useForm<SkillItem>({
    defaultValues: {
      name: "",
      category: "",
      subtitle: "",
      proficiency: 80,
      isCore: true,
      isVisible: true,
    },
  });

  const badgeText = Initials("name");

  const handleAddSkill = (data: SkillItem) => {
    append(data);
    skillForm.reset();
    setIsFormOpen(false);
  };

  const toggleVisibility = (index: number) => {
    const item = fields[index] as unknown as SkillItem;
    update(index, { ...item, isVisible: !item.isVisible });
  };

  return (
    <div className="p-4 sm:p-6 rounded-md border border-border/80 bg-card space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-2 text-foreground">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">Technical Arsenal</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 rounded-md cursor-pointer transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Technical Skill
        </button>
      </div>

      {isFormOpen && (
        <div className="p-4 border border-primary/30 bg-card/80 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <span className="font-bold text-foreground uppercase tracking-wider text-[11px]">
              Add New Skill
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between min-h-5.5">
                <label className="font-semibold text-muted-foreground uppercase text-[10px]">
                  Name
                </label>
              </div>
              <input
                type="text"
                {...skillForm.register("name", { required: true })}
                placeholder="e.g. Next.js"
                className="w-full bg-input/30 border border-border/80 px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between min-h-[22px]">
                <label className="font-semibold text-muted-foreground uppercase text-[10px]">
                  Category
                </label>
                <Link
                  href={"/dashboard/categories" as Route}
                  className="px-2 py-0.5 inline-flex items-center gap-1 border border-primary/40 rounded-md bg-primary font-semibold text-primary-foreground text-[10px] hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Manage
                </Link>
              </div>
              <select
                {...skillForm.register("category")}
                disabled={isCategoriesLoading || categories.length === 0}
                className="w-full bg-input/40 border border-border/80 px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md cursor-pointer"
              >
                <option value="">
                  {isCategoriesLoading
                    ? "Loading Categories..."
                    : categories.length === 0
                      ? "No active categories found"
                      : "Select a category"}
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.slug}
                    className="bg-card text-foreground font-medium"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground uppercase text-[10px]">
              Subtitle / Description
            </label>
            <input
              type="text"
              {...skillForm.register("subtitle")}
              placeholder="e.g. Server components & routing"
              className="w-full bg-input/30 border border-border/80 px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-muted-foreground uppercase text-[10px]">
                Skill Level ({skillForm.watch("proficiency")}%)
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              {...skillForm.register("proficiency", { valueAsNumber: true })}
              className="w-full accent-primary bg-input/40 h-1.5 rounded-md cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span>Featured in Core Ecosystem</span>
              <Info className="w-3.5 h-3.5" />
            </div>
            <input
              type="checkbox"
              {...skillForm.register("isCore")}
              className="accent-primary cursor-pointer w-4 h-4"
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
              onClick={skillForm.handleSubmit(handleAddSkill)}
              className="px-3 py-1.5 bg-primary text-primary-foreground font-semibold rounded-md cursor-pointer hover:opacity-90"
            >
              Save Skill
            </button>
          </div>
        </div>
      )}

      {/* Rendered Skill List */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const item = field as unknown as SkillItem;
          return (
            <div
              key={field.id}
              className="flex items-center justify-between p-3 border border-border/70 bg-card/40 hover:border-primary/40 transition-all group rounded-md"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                <div className="w-8 h-8 bg-primary/20 border border-primary/30 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                  {item.badgeText || item.name.substring(0, 2).toUpperCase()}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-foreground text-xs">
                      {item.name}
                    </h3>
                    <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary border border-primary/20">
                      {item.category}
                    </span>
                    {item.isCore && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <Star className="w-2.5 h-2.5 fill-amber-500" /> Core
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {item.subtitle} • {item.proficiency}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleVisibility(index)}
                  className="p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {item.isVisible ? (
                    <Eye className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-1.5 text-muted-foreground hover:text-destructive cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
