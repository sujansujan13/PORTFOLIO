"use client";

import { Search } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";

interface SearchControlBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder: string;
}
export function SearchControlBar({
  searchQuery,
  onSearchChange,
  placeholder,
}: SearchControlBarProps) {
  return (
    <div className="w-full  bg-card/30 border border-border p-4 mb-4 rounded-lg">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-muted-foreground " />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full dark:bg-[#0d233c] dark:text-foreground border border-border pl-10 pr-4 py-2.5 text-md rounded-md focus:outline-none focus:border-primary/60 dark:placeholder:text-muted-foreground placeholder:text-gray-600 transition-all font-sans"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2
                 w-7 h-7 flex items-center justify-center
                 rounded-full
                 text-foreground
                 hover:text-foreground
                 hover:bg-muted/70
                 active:scale-90
                 transition-all duration-150
                 cursor-pointer stroke-3"
          >
            <span className="text-xl leading-none font-semibold">×</span>
          </button>
        )}
      </div>
    </div>
  );
}
