"use client";
import React, { useMemo, useState } from "react";
import { InboxHeader } from "./inbox-header";
import {
  InboxFilters,
  type EmailNotificationFilter,
  type FilterStatus,
  type Subject,
  type SubjectFilter,
} from "./inbox-filters";
import { MessageCard } from "./message-card";
import { MessagePagination } from "./message-pagination";
import { useContactMessages } from "@/hooks/useContactMessages";

// Exact structure derived from your Mongoose Schema
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: Subject;
  message: string;
  status: "unread" | "read" | "archived";
  emailNotifications?: {
    status: "pending" | "sent" | "failed";
    sentAt: string | null;
    error?: string | null;
    providerMessageId?: string | null;
  };
  metadata?: {
    ipHash?: string | null;
    userAgent?: string | null;
    source?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export default function InboxClientPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<SubjectFilter>("all");
  const [activeTab, setActiveTab] = useState<FilterStatus>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const [emailStatusFilter, setEmailStatusFilter] =
    useState<EmailNotificationFilter>("all");

  const contactMessages = useContactMessages({
    search: searchQuery,
    page: page,
    status: activeTab,
    emailNotificationStatus: emailStatusFilter,
    subject: selectedSubject,
  });

  const { data: contact, isPending, isError } = contactMessages;

  const messages = contact?.messages ?? [];

  const counts = contact?.counts;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  const handleSubjectChange = (subject: Subject) => {
    setSelectedSubject(subject);
  };

  const handleStatusChange = (status: FilterStatus) => {
    setActiveTab(status);
  };

  const handleToggleRead = (id: string) => {};
  const handleOnArchive = (id: string) => {};

  const handleEmailStatusChange = (status: EmailNotificationFilter) => {
    setEmailStatusFilter(status);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };
  const limit = 10;
  const totalPages = Math.ceil(messages.length / limit);

  const handlePageChange = (page: number) => {
    setPage(page);
  };
  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8 ">
      <InboxHeader onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      <InboxFilters
        activeStatus={activeTab}
        onStatusChange={handleStatusChange}
        counts={counts}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        selectedSubject={selectedSubject}
        onSubjectChange={handleSubjectChange}
        emailStatusFilter={emailStatusFilter}
        onEmailStatusChange={handleEmailStatusChange}
      />
      <div className="space-y-2.5 min-h-75">
        {isPending ? (
          // Loading
          <div className="flex flex-col items-center justify-center py-12 text-center bg-card border border-border/80">
            <p className="text-sm font-semibold text-muted-foreground">
              Loading messages...
            </p>
          </div>
        ) : isError ? (
          // Error
          <div className="flex flex-col items-center justify-center py-12 text-center bg-card border border-border/80">
            <p className="text-sm font-semibold text-destructive">
              Failed to load contact messages.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please try again later.
            </p>
          </div>
        ) : messages.length > 0 ? (
          // Success + messages
          messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onToggleRead={handleToggleRead}
              onArchive={handleOnArchive}
            />
          ))
        ) : (
          // Success + no messages
          <div className="flex flex-col items-center justify-center py-12 text-center bg-card border border-border/80">
            <p className="text-sm font-semibold text-muted-foreground">
              No contact messages found.
            </p>
          </div>
        )}
      </div>
      <MessagePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
