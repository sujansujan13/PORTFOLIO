// apps/web/components/dashboard/status-header-panel.tsx
"use client";

import React, { useState } from "react";
import {
  Bell,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Library,
  Menu,
  Milestone,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "../mode-toggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import UserMenu from "../user-menu";
import { usePathname } from "next/navigation";
import type { Route } from "next";

export function StatusHeaderPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };
  const sideLinks: {
    label: string;
    icon: LucideIcon;
    href: string;
    isActive?: (href: string) => boolean;
  }[] = [
    {
      label: "Dashboard Home",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Project Manager",
      icon: FolderKanban,
      href: "/dashboard/projects",
    },
    {
      label: "Experience Timeline",
      icon: Milestone,
      href: "/dashboard/timeline",
    },
    {
      label: "Blog CMS",
      icon: Library,
      href: "/dashboard/blog",
    },
    {
      label: "Contact Inbox",
      icon: Inbox,
      href: "/dashboard/inbox",
    },
  ];
  return (
    <div className="w-full border-b border-border bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 text-foreground rounded-md hover:bg-accent transition-colors focus:outline-none"
                aria-label="Toggle Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-75 bg-background border-l border-border p-6 pt-16"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              <nav className="flex flex-col gap-5 text-lg font-medium mt-4">
                {sideLinks.map((link, i) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={i}
                      href={link.href as Route}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-foreground hover:bg-muted/60 border-transparentdark:text-[#d2e4fe] hover:text-primary transition-colors py-2 border-b border-(--border)/40 p-2",
                        active &&
                          "bg-primary p-2 text-white border-primary shadow-md rounded-lg",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <span className="text-sm font-semibold hidden md:inline">Overview</span>

        <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider">
            Database Sync: Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-1.5 rounded-full hover:bg-muted relative transition-colors cursor-pointer">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        <ModeToggle />

        <div className="border-l border-border pl-2">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
