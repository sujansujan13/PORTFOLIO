import Link from "next/link";
import { Plus } from "lucide-react";
import type { Route } from "next";

export function ProjectHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">
          Projects
        </h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">
          Manage and deploy your cloud infrastructure
        </p>
      </div>

      <Link
        href={"/dashboard/projects/new" as Route}
        className="inline-flex items-center justify-center bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold px-4 py-3 transition-colors duration-200 rounded-lg text-sm gap-2 outline-none group cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[3px] transition-transform duration-200 group-hover:rotate-90" />
        New Project
      </Link>
    </header>
  );
}

// Tailwind CSS
//
// inline-flex
