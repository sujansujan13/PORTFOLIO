import type { ProjectFormValues } from "@/schemas/project";
import { Globe, Star } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { BooleanToggleField } from "../forms/boolean-toggle-field";

interface ProjectVisibilityProps {
  register: UseFormRegister<ProjectFormValues>;
}

export default function ProjectVisibility({
  register,
}: ProjectVisibilityProps) {
  return (
    <div className="bg-card border border-border p-5 rounded-md text-left space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Project Visibility
      </h3>
      <BooleanToggleField
        title="Public Access"
        description="Visible on live portfolio index"
        icon={<Globe className="h-4 w-4 text-primary" />}
        registration={register("publicAccess")}
      />

      <BooleanToggleField
        title="Featured Project"
        description="Highlight this project in featured sections"
        icon={<Star className="h-4 w-4 text-primary" />}
        registration={register("featured")}
      />
    </div>
  );
}
