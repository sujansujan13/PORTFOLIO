import React from "react";
import * as LucideIcons from "lucide-react";

interface IconRendererProps {
  name: string;
  className?: string;
}

// Map dynamic string representations safely to Lucide icons
export function IconRenderer({ name, className }: IconRendererProps) {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    // Structural absolute fallback tracking
    return <LucideIcons.HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
}
