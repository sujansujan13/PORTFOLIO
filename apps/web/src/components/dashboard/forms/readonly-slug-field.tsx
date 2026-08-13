import { LinkIcon, Lock } from "lucide-react";
import React from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface ReadonlySlugFeldProps {
  label?: string;
  prefix: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

export default function ReadonlySlugField({
  label = "Slug",
  prefix,
  registration,
  error,
}: ReadonlySlugFeldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        <div className="flex gap-1 text-red-600 items-center text-xs font-medium uppercase tracking-wider border border-border rounded-sm py-1 px-2">
          <Lock className="w-3 h-3" />
          <span>Read-only</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm font-sans rounded-sm border border-border p-2.5 bg-input/40 cursor-not-allowed">
        <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
          <LinkIcon className="w-4 h-4" />
          <span>{prefix}</span>
        </div>
        <input
          type="text"
          id={label}
          {...registration}
          readOnly
          placeholder="auto-generated-slug"
          className="flex-1 w-full bg-transparent outline-none placeholder:text-muted-foreground/60 cursor-not-allowed"
        />
      </div>
      {error && (
        <span className="text-destructive text-xs mt-1.5 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
