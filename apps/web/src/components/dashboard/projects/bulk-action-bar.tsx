"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface BulkActionProps {
  selectedCount: number;
  selectedIds: string[];
  onDelete: (ids: string[]) => void;
  itemName?: string;
}

export function BulkActionBar({
  selectedCount,
  selectedIds,
  onDelete,
  itemName = "item",
}: BulkActionProps) {
  return (
    <div className="bg-[#0b1c30] border-2 border-destructive p-4 shadow-2xl rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-destructive/10 text-destructive border border-destructive/20">
            <AlertTriangle className="w-4 h-4" />
          </div>

          <div>
            <p className="text-sm font-bold text-foreground">
              Batch Selection Active
            </p>

            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {selectedCount} {selectedCount === 1 ? itemName : `${itemName}s`}{" "}
              staged for action
            </p>
          </div>
        </div>

        <button
          onClick={() => onDelete(selectedIds)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-destructive hover:bg-destructive/90 text-white font-semibold text-xs uppercase tracking-wider px-4 py-2.5 rounded-md"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Bulk Delete ({selectedCount})
        </button>
      </div>
    </div>
  );
}
