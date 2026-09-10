// components/dashboard/profile/profile-form.tsx
"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import HeroProfileSection, {
  type ProfileFormValues,
} from "./hero-profile-section";
import TechnicalArsenalSection, {
  type SkillItem,
} from "./technical-arsenal-section";
import LearningPathSection, { type GoalItem } from "./learning-path-section";
import { Rocket } from "lucide-react";
import { useUpsertProfile, useProfileById } from "@/hooks/useProfile";
import { toast } from "sonner";
import { uploadFile } from "@/utils/file-upload";
import { useEffect } from "react";

export interface CompleteDashboardFormData extends ProfileFormValues {
  skills: SkillItem[];
  learningGoals: GoalItem[];
}

type TabType = "hero" | "arsenal" | "learning";

export default function ProfileForm() {
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [isUploading, setIsUploading] = useState(false);
  const upsertProfile = useUpsertProfile();

  const { data: existingProfile, isLoading: isFetchingProfile } =
    useProfileById();

  // Single Unified React Hook Form instance for entire Dashboard
  const form = useForm<CompleteDashboardFormData>({
    defaultValues: {
      fullName: "",
      primaryRole: "",
      location: "",
      avatarUrl: "",
      resumeUrl: "",
      shortBio: "",
      fullBio: "",
      githubUrl: "",
      typewriterTitles: [],
      skills: [],
      learningGoals: [],
    },
  });

  useEffect(() => {
    if (existingProfile) {
      const p = existingProfile as any;
      form.reset({
        fullName: p.fullName || "",
        primaryRole: p.primaryRole || "",
        location: p.location || "",
        avatarUrl: p.avatarUrl || "",
        resumeUrl: p.resumeUrl || "",
        shortBio: p.shortBio || "",
        fullBio: p.fullBio || "",
        githubUrl: p.githubUrl || "",
        typewriterTitles: p.typeWriterTitles || p.typewriterTitles || [],
        skills: (p.skills || []).map((s: any) => ({
          id: s._id?.toString() || s.id,
          name: s.name || "",
          category: s.category || "Frontend",
          subtitle: s.subtitle || "",
          proficiency: s.proficiency ?? 80,
          isCore: s.isCore ?? false,
          isVisible: s.isVisible ?? true,
          badgeText: s.name ? s.name.substring(0, 2).toUpperCase() : "",
        })),
        learningGoals: (p.learningGoals || []).map((g: any) => ({
          id: g._id?.toString() || g.id,
          title: g.name || "",
          tag: g.status || "Learning",
          description: g.description || "",
          progress: g.progress ?? 0,
          badgeText: g.name ? g.name.substring(0, 2).toUpperCase() : "",
        })),
      });
    }
  }, [existingProfile, form]);

  if (isFetchingProfile) {
    return (
      <div className="w-full max-w-5xl mx-auto p-8 flex flex-col items-center justify-center min-h-87.5 space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-medium">
          Loading profile data...
        </p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<CompleteDashboardFormData> = async (data) => {
    try {
      setIsUploading(true);
      let avatarUrl = data.avatarUrl || "";
      let resumeUrl = data.resumeUrl || "";

      if (data.avatarFile && data.avatarFile.length > 0) {
        const avatarToast = toast.loading("Uploading avatar image...");
        try {
          // Pass "avatars" folder target
          avatarUrl = await uploadFile(data.avatarFile[0], "avatars");
          toast.dismiss(avatarToast);
        } catch (err: any) {
          toast.dismiss(avatarToast);
          toast.error(
            "Avatar upload failed: " + (err.message || "Unknown error"),
          );
          setIsUploading(false);
          return;
        }
      }

      if (data.cvFile && data.cvFile.length > 0) {
        const cvToast = toast.loading("Uploading CV PDF...");
        try {
          // Pass "documents" folder target
          resumeUrl = await uploadFile(data.cvFile[0], "documents");
          toast.dismiss(cvToast);
        } catch (err: any) {
          toast.dismiss(cvToast);
          toast.error("CV upload failed: " + (err.message || "Unknown error"));
          setIsUploading(false);
          return;
        }
      }

      upsertProfile.mutate(
        {
          fullName: data.fullName,
          primaryRole: data.primaryRole,
          location: data.location || "",
          avatarUrl: avatarUrl,
          resumeUrl: resumeUrl,
          typewriterTitles: data.typewriterTitles || [],
          shortBio: data.shortBio || "",
          fullBio: data.fullBio || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: (data as any).linkedinUrl || "",
          twitterUrl: (data as any).twitterUrl || "",
          skills: (data.skills || [])
            .filter((s) => s.name && s.name.trim() !== "")
            .map((s) => ({
              id: s.id,
              name: s.name.trim(),
              category: (s.category || "Frontend") as
                | "Frontend"
                | "Backend"
                | "Cloud"
                | "Database"
                | "Tools",
              subtitle: s.subtitle || "",
              proficiency: s.proficiency ?? 80,
              isCore: s.isCore ?? false,
              isVisible: s.isVisible ?? true,
            })),
          learningGoals: (data.learningGoals || [])
            .filter((g) => (g.title || (g as any).name) && (g.title || (g as any).name).trim() !== "")
            .map((g) => ({
              id: g.id,
              name: (g.title || (g as any).name || "").trim(),
              status: (g.tag || "Learning") as
                | "Exploring"
                | "Learning"
                | "Deep Dive",
              description: g.description || "",
              progress: g.progress ?? 0,
            })),
        },
        {
          onSuccess: () => {
            toast.success("Profile saved successfully!");
            setIsUploading(false);
          },
          onError: (err) => {
            toast.error(err.message || "Failed to save profile");
            setIsUploading(false);
          },
        },
      );
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
    >
      {/* Overview Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Profile & Skills CMS
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your public portfolio presence and technical capabilities.
        </p>
      </div>

      {/* Tabs & Save/Deploy Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/80 bg-card/40 p-1.5 rounded-md">
        <div className="flex items-center w-full sm:w-auto overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "hero"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            Hero & Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("arsenal")}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "arsenal"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            Technical Arsenal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("learning")}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === "learning"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            Learning Path
          </button>
        </div>

        <button
          type="submit"
          disabled={upsertProfile.isPending || isUploading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition-all rounded-md cursor-pointer shrink-0 shadow-sm disabled:opacity-50"
        >
          <Rocket className="w-4 h-4" />
          {isUploading
            ? "Uploading files..."
            : upsertProfile.isPending
              ? "Saving..."
              : "Save & Deploy Site"}
        </button>
      </div>

      {/* Dynamic Render Tabs */}
      <div>
        {activeTab === "hero" && <HeroProfileSection form={form} />}
        {activeTab === "arsenal" && (
          <TechnicalArsenalSection control={form.control} />
        )}
        {activeTab === "learning" && (
          <LearningPathSection control={form.control} />
        )}
      </div>
    </form>
  );
}
