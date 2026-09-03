"use client";
import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Milestone,
  Library,
  Inbox,
  Settings,
  Plus,
  ShieldUser,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

export default function Sidebar() {
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
      label: "Profile & Skills Manager",
      icon: ShieldUser,
      href: "/dashboard/profile",
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
      href: "/dashboard/blogs",
    },
    {
      label: "Contact Inbox",
      icon: Inbox,
      href: "/dashboard/inbox",
    },
  ];
  return (
    <div className="min-h-screen bg-background flex text-foreground font-sans">
      <aside className="hidden lg:flex w-64 bg-card border-r border-border flex-col justify-between fixed top-0 bottom-0 left-0 z-50">
        <div className="p-5">
          <div className="text-left border-b border-border pb-4 mb-6">
            <h1 className="text-lg font-black tracking-tight text-foreground">
              Portfolio.IO
            </h1>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-0.5">
              Admin Panel
            </p>
          </div>
          <nav className="space-y-1">
            {sideLinks.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  href={link.href as Route}
                  key={i}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold tracking-wide transition-all rounded-sm cursor-pointer border ${
                    active
                      ? "bg-primary text-white border-primary shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border-transparent"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors rounded-sm cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </aside>
    </div>
  );
}
