"use client";
import { useMemo, useState } from "react";

export function useDashboardSelection(currentViewIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /**
   * Select or unselect one row
   */
  const toggleSelectRow = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  /**
   * Select all visible rows.
   *
   * If all visible rows are already selected,
   * remove them from the selection.
   *
   * Otherwise, add all visible rows.
   */
  const toggleSelectAll = () => {
    setSelectedIds((current) => {
      const allSelected =
        currentViewIds.length > 0 &&
        currentViewIds.every((id) => current.includes(id));

      if (allSelected) {
        return current.filter((id) => !currentViewIds.includes(id));
      }

      return Array.from(new Set([...current, ...currentViewIds]));
    });
  };

  /**
   * Whether every visible row is selected.
   */
  const isAllSelected = useMemo(() => {
    return (
      currentViewIds.length > 0 &&
      currentViewIds.every((id) => selectedIds.includes(id))
    );
  }, [currentViewIds, selectedIds]);

  /**
   * Number of selected rows.
   */
  const selectedCount = selectedIds.length;

  /**
   * Clear every selection.
   */
  const clearSelection = () => {
    setSelectedIds([]);
  };

  /**
   * Reset selection when needed.
   */
  const resetSelection = () => {
    setSelectedIds([]);
  };

  return {
    selectedIds,
    selectedCount,
    isAllSelected,
    toggleSelectRow,
    toggleSelectAll,
    clearSelection,
    resetSelection,
  };
}
