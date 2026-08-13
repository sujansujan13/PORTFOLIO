import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import TextField from "../forms/text-field";
import type { ProjectFormValues } from "@/schemas/project";

interface ProjectSpecificField {
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
}

export default function ProjectSpecificField({
  register,
  errors,
}: ProjectSpecificField) {
  return (
    <div className="-mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4  ">
      <TextField
        label="Role"
        registration={register("role")}
        placeholder="Full-Stack Developer"
        error={errors.role?.message}
        className="w-full"
      />
      <TextField
        label="Timeline"
        registration={register("timeline")}
        placeholder="Feb,2025 - Apr,2025"
        error={errors.timeline?.message}
        className="w-full"
      />
    </div>
  );
}
// div className="-mt-2 w-full flex flex-row items-center justify-between "
