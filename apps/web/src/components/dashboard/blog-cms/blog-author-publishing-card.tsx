"use client";
import { CalendarDays, UserRound, X } from "lucide-react";
import Image from "next/image";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";

import type { BlogFormInput, BlogFormValues } from "@/schemas/blog.schema";
import BlogAuthorAvatar from "./blog-author-avatar";

interface BlogAuthorPublishingCardProps {
  register: UseFormRegister<BlogFormInput>;
  setValue: UseFormSetValue<BlogFormInput>;
  control: Control<BlogFormInput, unknown, BlogFormValues>;
  errors: FieldErrors<BlogFormInput>;
  avatar?: string;
}

export default function BlogAuthorPublishingCard({
  register,
  setValue,
  errors,
  avatar,
  control,
}: BlogAuthorPublishingCardProps) {
  function handleRemoveAvatar() {
    setValue("author.avatar", "", {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  }

  return (
    <div className="bg-card border border-border p-5 rounded-md space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Author & Publishing
        </h3>

        <p className="text-[11px] text-muted-foreground mt-1">
          Manage author information and publication settings.
        </p>
      </div>

      {/* Author */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <UserRound className="w-3.5 h-3.5 text-primary" />

          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Author
          </span>
        </div>

        {/* Avatar */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground ">
            Author Avatar
          </label>

          <div className="flex items-center gap-4 mt-2">
            {/* Upload Area */}
            <Controller
              name="author.avatar"
              control={control}
              render={({ field, fieldState }) => (
                <BlogAuthorAvatar
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Author Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="author-name"
            className="text-xs font-medium text-foreground"
          >
            Author Name
          </label>

          <input
            id="author-name"
            type="text"
            placeholder="e.g. John Doe"
            {...register("author.name")}
            className="w-full bg-input/40 border border-border px-3 py-2.5 text-xs rounded-sm outline-none focus:border-primary transition-colors"
          />

          {errors.author?.name && (
            <p className="text-[11px] text-destructive">
              {errors.author.name.message}
            </p>
          )}
        </div>

        {/* Author Role */}
        <div className="space-y-1.5">
          <label
            htmlFor="author-role"
            className="text-xs font-medium text-foreground"
          >
            Author Role
          </label>

          <input
            id="author-role"
            type="text"
            placeholder="e.g. Full Stack Developer"
            {...register("author.role")}
            className="w-full bg-input/40 border border-border px-3 py-2.5 text-xs rounded-sm outline-none focus:border-primary transition-colors"
          />

          {errors.author?.role && (
            <p className="text-[11px] text-destructive">
              {errors.author.role.message}
            </p>
          )}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Publishing */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-3.5 h-3.5 text-primary" />

          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Publishing
          </span>
        </div>
        <Controller
          name="publishedAt"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <input
                type="datetime-local"
                value={
                  field.value instanceof Date
                    ? field.value.toISOString().slice(0, 16)
                    : typeof field.value === "string"
                      ? field.value
                      : ""
                }
                onChange={(e) => field.onChange(e.target.value)}
              />

              {fieldState.error && (
                <p className="text-xs text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />{" "}
      </div>
    </div>
  );
}
