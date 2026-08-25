"use client";

import React, { type Dispatch } from "react";
import { Search, ChevronDown, X, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { div } from "framer-motion/client";
import MarkAllModal from "./ui/mark-all-modal";

export type FilterStatus = "all" | "unread" | "read" | "archived" | "spam";
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
    spam: number;
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
  onMarkAllRead: () => void;
  setIsModalOpen: Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
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
  setIsModalOpen,
  isModalOpen,
  onMarkAllRead,
}: InboxFiltersProps) {
  const tabs: { id: FilterStatus; label: string; count: number | undefined }[] =
    [
      { id: "all", label: "All", count: counts?.total },
      { id: "unread", label: "Unread", count: counts?.unread },
      { id: "read", label: "Read", count: counts?.read },
      { id: "archived", label: "Archived", count: counts?.archived },
      { id: "spam", label: "Spam", count: counts?.spam },
    ];

  return (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 justify-between">
        {" "}
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
        <div className="relative ">
          {isModalOpen && (
            <>
              {" "}
              <div
                onClick={() => setIsModalOpen(false)}
                className="fixed inset-0 z-40"
              />
              {/* 
        Mobile: Positioned above the button, aligned to right edge (top-auto bottom-full right-0)
        Tablet/Desktop (sm+): Shifts leftwards beside the button (sm:bottom-4 sm:right-full sm:left-auto)
      */}
              <div className="absolute bottom-full right-0 mb-2 sm:mb-0 sm:bottom-4 sm:right-full z-50 whitespace-nowrap">
                <MarkAllModal
                  title="Mark all messages as Read?"
                  onConfirm={onMarkAllRead}
                  onCancel={() => setIsModalOpen(false)}
                />
              </div>
            </>
          )}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-xs font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CheckCheck className="w-3.5 h-3.5 opacity-80" />
            Mark all as read
          </button>
        </div>
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
