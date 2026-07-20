"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";

interface PaginationProps {
  totalCount: number;
}

export function DynamicPagination({ totalCount }: PaginationProps) {
  const { currentPage, setCurrentPage } = useProjectStore();

  return (
    <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-border mt-8 select-none">
      <p className="text-xs text-muted-foreground font-mono text-center sm:text-left">
        Showing{" "}
        <span className="text-foreground font-bold">1-{totalCount}</span> of{" "}
        <span className="text-foreground font-bold">{totalCount}</span> records
      </p>

      <nav
        aria-label="Pagination Navigation"
        className="flex items-center justify-center gap-1"
      >
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="p-2 border border-border bg-card/20 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground transition-colors rounded-md outline-none cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => setCurrentPage(1)}
          className={`px-3.5 py-1.5 text-xs font-mono rounded-md font-bold border transition-all  ${
            currentPage === 1
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-card/20 hover:bg-border/30 text-foreground"
          }`}
        >
          1
        </button>

        <button
          onClick={() => setCurrentPage(2)}
          className={`px-3.5 py-1.5 text-xs font-mono font-bold border transition-all rounded-md ${
            currentPage === 2
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-card/20 hover:bg-border/30 text-foreground"
          }`}
        >
          2
        </button>

        <span className="px-2 text-xs text-muted-foreground font-mono">
          ...
        </span>

        <button
          onClick={() => setCurrentPage(5)}
          className={`px-3.5 py-1.5 text-xs font-mono font-bold border transition-all rounded-md ${
            currentPage === 5
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-card/20 hover:bg-border/30 text-foreground"
          }`}
        >
          5
        </button>

        <button
          disabled={currentPage === 5}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="p-2 border border-border bg-card/20 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground transition-colors rounded-md outline-none cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </footer>
  );
}
