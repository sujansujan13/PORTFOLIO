"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";

export function BulkActionBar() {
  const { selectedIds, deleteSelectedProjects } = useProjectStore();
  const activeCount = selectedIds.length;

  if (activeCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#0b1c30] border-2 border-destructive p-4 shadow-2xl z-50 transition-all animate-in fade-in slide-in-from-bottom-4 rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/10 text-destructive border border-destructive/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground font-sans">
              Batch Selection Active
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {activeCount} {activeCount === 1 ? "record" : "records"} staged
              for action
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (
              confirm(
                `Permanently wipe out ${activeCount} selected projects from database storage?`,
              )
            ) {
              deleteSelectedProjects();
            }
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-destructive   hover:bg-destructive/90 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2.5 transition-colors rounded-md cursor-pointer outline-none focus:ring-2 focus:ring-ring"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Bulk Delete ({activeCount})
        </button>
      </div>
    </div>
  );
}
