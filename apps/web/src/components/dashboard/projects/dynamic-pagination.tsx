"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface DynamicPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function DynamicPagination({
  pagination,
  onPageChange,
}: DynamicPaginationProps) {
  if (pagination.totalPages === 0) return null;

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(
    pagination.page * pagination.limit,
    pagination.totalPages,
  );

  return (
    <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-border mt-8 select-none">
      <p className="text-xs text-muted-foreground font-mono text-center sm:text-left">
        Showing{" "}
        <span className="text-foreground font-bold">
          {start}-{end}
        </span>{" "}
        of{" "}
        <span className="text-foreground font-bold">
          {pagination.totalPages}
        </span>{" "}
        records
      </p>

      <nav
        aria-label="Pagination Navigation"
        className="flex items-center justify-center gap-1"
      >
        <button
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(pagination.page - 1)}
          className="p-2 border border-border bg-card/20 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground transition-colors rounded-md outline-none cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3.5 py-1.5 text-xs font-mono rounded-md font-bold border bg-primary text-primary-foreground border-primary">
          {pagination.page}
        </span>

        <button
          type="button"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
          className="p-2 border border-border bg-card/20 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors rounded-md cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </footer>
  );
}
