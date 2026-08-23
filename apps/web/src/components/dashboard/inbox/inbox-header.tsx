"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

interface InboxHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function InboxHeader({ onRefresh, isRefreshing }: InboxHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Contact Messages
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage inquiries and communication from your portfolio.
        </p>
      </div>

      {/* Refresh Button */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-foreground bg-card hover:bg-accent border border-border/80 rounded-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer w-fit"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 text-primary ${isRefreshing ? "animate-spin" : ""}`}
        />
        <span>Refresh</span>
      </button>
    </div>
  );
}
