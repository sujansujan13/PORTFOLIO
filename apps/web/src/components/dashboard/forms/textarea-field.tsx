import React, { type InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface TextareaFieldProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  rows: number;
}

export default function TextareaField({
  label,
  registration,
  error,
  className = "",
  ...props
}: TextareaFieldProps) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
      >
        {label}
      </label>
      <textarea
        type="text"
        id={label}
        {...registration}
        {...props}
        className={`w-full bg-input/40 border border-border p-2.5 text-sm font-sans focus:outline-none focus:border-primary transition-all rounded-sm placeholder:text-muted-foreground/60 ${className}`}
      />

      {error && (
        <span className="text-destructive text-xs mt-1.5 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
