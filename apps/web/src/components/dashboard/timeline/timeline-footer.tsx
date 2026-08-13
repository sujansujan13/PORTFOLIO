"use client";

import React from "react";

export function TimelineFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
      <p>&copy; {currentYear} DevPortal. Built for Performance.</p>
      <nav aria-label="Footer navigation" className="flex items-center gap-6">
        <a
          href="#documentation"
          className="hover:text-foreground transition-colors"
        >
          Documentation
        </a>
        <a href="#support" className="hover:text-foreground transition-colors">
          Support
        </a>
        <a href="#privacy" className="hover:text-foreground transition-colors">
          Privacy
        </a>
      </nav>
    </footer>
  );
}
