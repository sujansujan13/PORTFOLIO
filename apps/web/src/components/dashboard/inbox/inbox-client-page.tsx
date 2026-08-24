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
import {
  useArchiveMessages,
  useContactMessages,
  useMarkAllRead,
  useUpdateReadStatus,
} from "@/hooks/useContactMessages";
import { toast } from "sonner";

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
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [emailStatusFilter, setEmailStatusFilter] =
    useState<EmailNotificationFilter>("all");

  const contactMessages = useContactMessages({
    search: searchQuery,
    page: page,
    status: activeTab,
    emailNotificationStatus: emailStatusFilter,
    subject: selectedSubject,
  });

  const {
    data: contact,
    isPending,
    isError,
    refetch,
    isFetching,
  } = contactMessages;

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

  const updateReadStatus = useUpdateReadStatus();
  const handleToggleRead = (message: ContactMessage) => {
    const status = message.status === "read" ? "unread" : "read";

    updateReadStatus.mutate({
      id: message.id,
      status,
    });

    toast.success(`Message marked ${status === "read" ? "unread" : "read"}`, {
      position: "top-center",
    });
  };

  const archiveMessage = useArchiveMessages();
  const handleOnArchive = (id: string) => {
    archiveMessage.mutate({ id });
    toast.success("Message Archived", {
      position: "top-center",
    });
  };

  const handleEmailStatusChange = (status: EmailNotificationFilter) => {
    setEmailStatusFilter(status);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const markAllRead = useMarkAllRead();

  const handleMarkAllRead = () => {
    markAllRead.mutate();
    setIsModalOpen(false);
    toast.success("Marked all messages read");
  };

  const pagination = contact?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const hasNextPage = pagination?.hasNextPage ?? false;
  const hasPreviousPage = pagination?.hasPreviousPage ?? false;
  const currentPage = pagination?.page ?? 1;

  return (
    <main className="max-w-7xl mx-auto space-y-4 p-4 sm:p-6 lg:p-8 ">
      <InboxHeader onRefresh={handleRefresh} isRefreshing={isFetching} />
      <InboxFilters
        activeStatus={activeTab}
        onMarkAllRead={handleMarkAllRead}
        onStatusChange={handleStatusChange}
        counts={counts}
        setIsModalOpen={setIsModalOpen}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        selectedSubject={selectedSubject}
        onSubjectChange={handleSubjectChange}
        emailStatusFilter={emailStatusFilter}
        onEmailStatusChange={handleEmailStatusChange}
        isModalOpen={isModalOpen}
      />
      <div className="space-y-3 min-h-75">
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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
