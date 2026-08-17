// registration: UseFormRegisterReturn;

//  className = "",######
// ...props
import React, { type InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

export default function TextField({
  label,
  registration,
  error,
  className = "",
  ...props
}: TextFieldProps) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5"
      >
        {label}
      </label>
      <input
        type="text"
        id={label}
        {...registration}
        {...props}
        className={`w-full bg-input/40 border ${
          error
            ? "border-destructive focus:border-destructive"
            : "border-border focus:border-primary"
        } p-2.5 text-sm font-sans focus:outline-none transition-all rounded-sm placeholder:text-muted-foreground/60 ${className}`}
      />

      {error && (
        <span className="text-destructive text-xs mt-1.5 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
