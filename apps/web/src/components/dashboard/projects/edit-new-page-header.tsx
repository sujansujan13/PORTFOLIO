import Link from "next/link";
import React from "react";
import type { Route } from "next";
import { ArrowLeft } from "lucide-react";

interface pageProps {
  title: string;
  desc: string;
  children: React.ReactNode;
  backHref: string;
  backLabel?: string;
}

export default function DualHeader({
  title,
  desc,
  children,
  backHref,
  backLabel,
}: pageProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link
          // title="Back to Projects"
          href={backHref as Route}
          className="p-1.5 border border-border bg-card/40 hover:bg-muted transition-c  olors rounded-md group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
          <span className="px-4 py-2 hidden lg:flex bg-gray-950 rounded-lg opacity-0 group-hover:opacity-100 absolute mt-5.5 text-xs text-foreground font-semibold">
            {backLabel}
          </span>
        </Link>
        <div className="text-left shrink-0">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground leading-none ">
            {title}
          </span>
          <h1 className="text-sm font-bold tracking-wide text-foreground mt-0.5">
            {desc}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
