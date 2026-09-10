"use client";

import React, { useRef, useState, useEffect } from "react";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";
import {
  User,
  MapPin,
  Sparkles,
  X,
  FileText,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { CompleteDashboardFormData } from "./profile-form";
import { TiptapEditorSmall } from "../utils/tiptap-editor-small";

export interface ProfileFormValues {
  fullName: string;
  primaryRole: string;
  location?: string;
  shortBio?: string;
  fullBio?: string;
  githubUrl?: string;
  avatarUrl?: string;
  avatarFile?: FileList;
  resumeUrl?: string;
  cvFile?: FileList;
  typewriterTitles: string[];
}

interface HeroProfileSectionProps {
  form: UseFormReturn<CompleteDashboardFormData>;
}

export default function HeroProfileSection({ form }: HeroProfileSectionProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const roles = watch("typewriterTitles") || [];
  const [roleInput, setRoleInput] = useState("");

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const cvInputRef = useRef<HTMLInputElement | null>(null);

  const watchedAvatarFile = useWatch({
    control,
    name: "avatarFile",
  });
  const watchedAvatarUrl = useWatch({
    control,
    name: "avatarUrl",
  });
  const watchedCv = useWatch({
    control,
    name: "cvFile",
  });
  const watchedResumeUrl = useWatch({
    control,
    name: "resumeUrl",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (watchedAvatarFile && watchedAvatarFile.length > 0) {
      const file = watchedAvatarFile[0];
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setAvatarPreview(null);
    }
  }, [watchedAvatarFile]);

  const avatarRegister = register("avatarFile");
  const cvRegister = register("cvFile");

  const handleAddRole = () => {
    if (roleInput.trim() && !roles.includes(roleInput.trim())) {
      setValue("typewriterTitles", [...roles, roleInput.trim()]);
      setRoleInput("");
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setValue(
      "typewriterTitles",
      roles.filter((role) => role !== roleToRemove),
    );
  };

  return (
    <div className="p-4 sm:p-6 rounded-md border border-border/80 bg-card space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border/50 text-foreground">
        <User className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold">Hero & Profile Settings</h2>
      </div>

      <div className="space-y-4 text-xs">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            {...register("fullName", { required: "Full name is required" })}
            placeholder="Enter full name"
            className="w-full bg-input/30 border border-border/80 px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md transition-colors"
          />
          {errors.fullName && (
            <p className="text-[10px] text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Primary Role */}
        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            Primary Role
          </label>
          <input
            type="text"
            {...register("primaryRole", {
              required: "Primary role is required",
            })}
            placeholder="e.g. Full-Stack Architect"
            className="w-full bg-input/30 border border-border/80 px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md transition-colors"
          />
          {errors.primaryRole && (
            <p className="text-[10px] text-destructive">
              {errors.primaryRole.message}
            </p>
          )}
        </div>

        {/* Location Tag */}
        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            Location Tag
          </label>
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 absolute left-3 text-muted-foreground" />
            <input
              type="text"
              {...register("location")}
              placeholder="e.g. Kathmandu, Nepal"
              className="w-full bg-input/30 border border-border/80 pl-9 pr-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md transition-colors"
            />
          </div>
        </div>

        {/* Animated Roles (Typewriter Tag Manager) */}
        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-1.5 font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Animated Roles (Typewriter Effect)
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddRole())
              }
              placeholder="e.g. UI/UX Designer"
              className="w-full bg-input/30 border border-border/80 px-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md transition-colors"
            />
            <button
              type="button"
              onClick={handleAddRole}
              className="px-4 py-2 bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/40 font-semibold transition-all cursor-pointer rounded-md"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-medium"
              >
                {role}
                <button
                  type="button"
                  onClick={() => handleRemoveRole(role)}
                  className="hover:text-destructive transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Short Bio */}
        <div className="space-y-1.5 pt-2">
          <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            Short Bio (Hero Section)
          </label>
          <Controller
            name="shortBio"
            control={control}
            render={({ field }) => (
              <TiptapEditorSmall
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Write a concise hero bio for your homepage..."
                minHeight="100px"
              />
            )}
          />
        </div>

        {/* About Bio Detailed */}
        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            About Bio (Detailed)
          </label>
          <Controller
            name="fullBio"
            control={control}
            render={({ field }) => (
              <TiptapEditorSmall
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Write a detailed bio introducing your background, architecture philosophy, and stack..."
                minHeight="150px"
              />
            )}
          />
        </div>

        {/* Avatar Image Input */}
        <div className="space-y-1.5 pt-2 rounded-md">
          <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            Avatar Image
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            {...avatarRegister}
            ref={(e) => {
              avatarRegister.ref(e);
              avatarInputRef.current = e;
            }}
          />
          <div
            onClick={() => avatarInputRef.current?.click()}
            className="border-2 border-dashed border-border/80 bg-input/10 hover:bg-input/20 p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 rounded-md"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/40 bg-card flex items-center justify-center">
              {avatarPreview || watchedAvatarUrl ? (
                <img
                  src={avatarPreview || watchedAvatarUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <span className="text-primary font-semibold hover:underline">
              {watchedAvatarFile && watchedAvatarFile.length > 0
                ? watchedAvatarFile[0].name
                : watchedAvatarUrl
                  ? "Replace Image"
                  : "Upload Image"}
            </span>
          </div>
        </div>

        {/* Resume/CV PDF Input */}
        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            Resume/CV PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            {...cvRegister}
            ref={(e) => {
              cvRegister.ref(e);
              cvInputRef.current = e;
            }}
          />
          <div
            onClick={() => cvInputRef.current?.click()}
            className="border-2 border-dashed border-border/80 bg-input/10 hover:bg-input/20 p-6 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 rounded-md"
          >
            <FileText className="w-6 h-6 text-primary" />
            <span className="text-primary font-semibold hover:underline">
              {watchedCv && watchedCv.length > 0
                ? watchedCv[0].name
                : watchedResumeUrl
                  ? "Replace PDF"
                  : "Upload PDF"}
            </span>
          </div>
        </div>

        {/* GitHub URL */}
        <div className="space-y-1.5">
          <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
            GitHub URL
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center text-muted-foreground gap-1 border-r border-border/60 pr-2">
              <FaGithub className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono">git</span>
            </div>
            <input
              type="url"
              {...register("githubUrl")}
              className="w-full bg-input/30 border border-border/80 pl-16 pr-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
