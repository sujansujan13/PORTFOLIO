import { Globe } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { BooleanToggleField } from "@/components/dashboard/forms/boolean-toggle-field";
import type { BlogFormInput } from "@/schemas/blog.schema";

interface ProjectVisibilityProps {
  register: UseFormRegister<BlogFormInput>;
}

export default function BlogVisibility({ register }: ProjectVisibilityProps) {
  return (
    <div className="bg-card border border-border p-5 rounded-md text-left space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Blog Publish
      </h3>
      <BooleanToggleField
        title="Published"
        description="Visible on live blog "
        icon={<Globe className="h-4 w-4 text-primary" />}
        registration={register("publicAccess")}
      />
    </div>
  );
}
