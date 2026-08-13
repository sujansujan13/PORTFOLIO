import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface BooleanToggleFieldProps {
  title: string;
  description: string;
  icon?: ReactNode;
  registration: UseFormRegisterReturn;
}

export function BooleanToggleField({
  title,
  description,
  icon,
  registration,
}: BooleanToggleFieldProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-background/40 border border-border rounded-md">
      <div className="flex items-center gap-3">
        {icon && <div className="shrink-0">{icon}</div>}
        <div>
          <p className="text-xs font-bold">{title}</p>
          {description && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <label
        htmlFor={title}
        className="relative inline-flex items-center cursor-pointer select-none"
      >
        <input
          type="checkbox"
          {...registration}
          className="sr-only peer"
          id={title}
        />
        <div className="w-9 h-5 bg-input peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );
}
