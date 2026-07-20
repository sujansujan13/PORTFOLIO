"use client";

import { Search } from "lucide-react";
import { useProjectStore } from "@/stores/useProjectStore";

export function SearchControlBar() {
  const { searchQuery, setSearchQuery } = useProjectStore();

  return (
    <div className="w-full bg-card/30 border border-border p-4 mb-4 rounded-lg">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dark:text-muted-foreground text-white" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects, categories, or status..."
          className="w-full dark:bg-[#0d233c] bg-gray-500 text-foreground border border-border pl-10 pr-4 py-2.5 text-md rounded-md focus:outline-none focus:border-primary/60 dark:placeholder:text-muted-foreground placeholder:text-gray-300 transition-all font-sans"
        />
      </div>
    </div>
  );
}
