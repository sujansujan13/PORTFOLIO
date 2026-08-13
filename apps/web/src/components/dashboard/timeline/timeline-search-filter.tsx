"use client";

import { Search, X } from "lucide-react";

export type TimelineFilterType = "all" | "experience" | "education";

interface TimelineCounts {
  all: number;
  experience: number;
  education: number;
}

interface TimelineSearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;

  type: TimelineFilterType;
  onTypeChange: (type: TimelineFilterType) => void;

  counts: TimelineCounts;

  isLoading?: boolean;
}

export default function TimelineSearchFilter({
  search,
  onSearchChange,
  type,
  onTypeChange,
  counts,
  isLoading = false,
}: TimelineSearchFilterProps) {
  const filters: {
    value: TimelineFilterType;
    label: string;
    count: number;
  }[] = [
    {
      value: "all",
      label: "All",
      count: counts.all,
    },
    {
      value: "experience",
      label: "Experience",
      count: counts.experience,
    },
    {
      value: "education",
      label: "Education",
      count: counts.education,
    },
  ];

  return (
    <div className="w-full space-y-4 pb-5">
      {/* =====================================================
          SEARCH
      ====================================================== */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground " />

        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search timeline entries..."
          className="w-full rounded-md border border-border bg-card py-2.5 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {/* Clear search */}
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* =====================================================
          FILTER + COUNTS
      ====================================================== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const isActive = type === filter.value;
            const typeStyles =
              filter.value === "education"
                ? "border-t-amber-500"
                : filter.value === "experience"
                  ? "border-t-primary"
                  : "";
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onTypeChange(filter.value)}
                disabled={isLoading}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-all  duration-200 ${typeStyles} disabled:cursor-not-allowed disabled:opacity-50 ${
                  isActive
                    ? "border-primary border-t-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <span>{filter.label}</span>

                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Total entries */}
        <div className="text-xs text-muted-foreground">
          {isLoading ? (
            <span>Loading...</span>
          ) : (
            <span className="text-md font-medium">
              <span className="font-semibold text-foreground">
                {counts.all}
              </span>{" "}
              {counts.all === 1 ? "entry" : "entries"} total
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
