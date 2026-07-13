"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Globe, EyeOff } from "lucide-react";
import { useDashboardStore } from "@/stores/use-dashboard-store";

const projectSchema = z.object({
  title: z.string().min(3, "Title must contain at least 3 characters"),
  subtitle: z.string().min(5, "Subtitle must contain at least 5 characters"),
  category: z.string().min(2, "Select a valid project categorization tag"),
  image: z
    .any()
    .refine((files) => files?.length === 1, "Image is required")
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "Maximum file size is 5MB",
    ),
  publiclyListed: z.boolean(),
});

type FormValues = z.infer<typeof projectSchema>;

export function ProjectModal() {
  const { isProjectModalOpen, editingProject, closeProjectModal } =
    useDashboardStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      category: "WEB APP",
      image: "",
      publiclyListed: true,
    },
  });

  useEffect(() => {
    if (editingProject) {
      reset({
        title: editingProject.title,
        subtitle: editingProject.subtitle,
        category: editingProject.category,
        image: editingProject.imageUrl,
        publiclyListed: editingProject.publiclyListed,
      });
    } else {
      reset({
        title: "",
        subtitle: "",
        category: "WEB APP",
        image: "",
        publiclyListed: true,
      });
    }
  }, [editingProject, isProjectModalOpen, reset]);

  const onSubmit = (data: FormValues) => {
    console.log("Submitting record transaction bundle via tRPC:", data);
    closeProjectModal();
  };

  const isPublic = watch("publiclyListed");

  return (
    <AnimatePresence>
      {isProjectModalOpen && (
        <>
          {/* Backdrop Blur overlay matching your exact palette structure */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProjectModal}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
          />

          {/* Slide Drawer Content Component wrapper */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md md:max-w-lg bg-card border-l border-border p-6 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    {editingProject ? "Edit Project" : "Create Project"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Modify project metadata and tech stack.
                  </p>
                </div>
                <button
                  onClick={closeProjectModal}
                  className="p-1.5 rounded-sm hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                id="project-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 text-left"
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Project Title
                  </label>
                  <input
                    {...register("title")}
                    className="w-full bg-input/40 border border-border p-2.5 text-sm focus:outline-none focus:border-primary transition-all rounded-sm"
                  />
                  {errors.title && (
                    <span className="text-destructive text-xs mt-1 block">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Project Description
                  </label>
                  <textarea
                    {...register("subtitle")}
                    className="w-full bg-input/40 border border-border p-2.5 text-sm focus:outline-none focus:border-primary transition-all rounded-sm"
                  />
                  {errors.subtitle && (
                    <span className="text-destructive text-xs mt-1 block">
                      {errors.subtitle.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Thumbnail URL
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="w-full bg-input/40 border border-border p-2.5 text-sm focus:outline-none focus:border-primary transition-all rounded-sm"
                  />
                  {errors.image && (
                    <span className="text-destructive text-xs mt-1 block">
                      {errors.image.message as string}
                    </span>
                  )}
                </div>

                {/* Sub-Card Component for toggle options */}
                <div className="p-4 bg-muted/40 border border-border/80 rounded-sm mt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isPublic ? (
                        <Globe className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          Visibility Settings
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isPublic
                            ? "Publicly listed"
                            : "Hidden from portfolio view"}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) =>
                          setValue("publiclyListed", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex items-center gap-3 border-t border-border pt-4 mt-6">
              <button
                type="button"
                onClick={closeProjectModal}
                className="flex-1 py-2.5 text-sm font-medium border border-border hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="project-form"
                className="flex-1 py-2.5 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
