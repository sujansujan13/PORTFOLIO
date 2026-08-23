"use client";

import React from "react";
import { Search, ChevronDown, X } from "lucide-react";

export type FilterStatus = "all" | "unread" | "read" | "archived";
export type EmailNotificationFilter = "all" | "sent" | "pending" | "failed";
export type Subject = "collaboration" | "internship" | "general";

export type SubjectFilter = "all" | Subject;

interface InboxFiltersProps {
  activeStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
  counts?: {
    total: number;
    unread: number;
    read: number;
    archived: number;
    sent: number;
    pending: number;
    failed: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSubject: string;
  onSubjectChange: (subject: Subject) => void;
  emailStatusFilter: EmailNotificationFilter;
  onEmailStatusChange: (status: EmailNotificationFilter) => void;
}

export function InboxFilters({
  activeStatus,
  onStatusChange,
  counts,
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  emailStatusFilter,
  onEmailStatusChange,
}: InboxFiltersProps) {
  const tabs: { id: FilterStatus; label: string; count: number | undefined }[] =
    [
      { id: "all", label: "All", count: counts?.total },
      { id: "unread", label: "Unread", count: counts?.unread },
      { id: "read", label: "Read", count: counts?.read },
      { id: "archived", label: "Archived", count: counts?.archived },
    ];

  return (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative w-full max-w-lg pb-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or content..."
          className="w-full bg-input/30 border border-border/80 pl-9 pr-4 py-1.5 text-sm font-sans text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary transition-colors rounded-md"
        />
        {/* Clear search */}
        {searchQuery && (
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

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-1.5 px-2 bg-card border border-border/80 rounded-md">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusChange(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold transition-all rounded-sm cursor-pointer ${
                activeStatus === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded-full ${
                  activeStatus === tab.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden lg:block w-px h-5 bg-border/90 shrink-0" />

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Subject Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedSubject}
              onChange={(e) => onSubjectChange(e.target.value as Subject)}
              className="w-full sm:w-40 appearance-none bg-input/30 border border-border/80 px-3 py-1 pr-7 text-xs font-semibold text-foreground focus:outline-none focus:border-primary rounded-none cursor-pointer"
            >
              <option value="all">All Subjects</option>
              <option value="collaboration">Collaboration</option>
              <option value="internship">Internship</option>
              <option value="general">General</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Email Notification Status Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={emailStatusFilter}
              onChange={(e) =>
                onEmailStatusChange(e.target.value as EmailNotificationFilter)
              }
              className="w-full sm:w-44 appearance-none bg-input/30 border border-border/80 px-3 py-1 pr-7 text-xs font-semibold text-foreground focus:outline-none focus:border-primary rounded-none cursor-pointer"
            >
              <option value="all">Email: All Delivery</option>
              <option value="sent">Email: Sent</option>
              <option value="pending">Email: Pending</option>
              <option value="failed">Email: Failed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
