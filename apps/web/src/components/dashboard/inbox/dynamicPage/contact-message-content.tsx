// components/contact/ContactMessageContent.tsx
"use client";

import React from "react";

import type { ContactMessage } from "./../dynamicPage/contact-client-page";
import { Initials } from "./utils/initials";

interface ContactMessageContentProps {
  contact: ContactMessage;
}

export function ContactMessageContent({ contact }: ContactMessageContentProps) {
  // Get initials for avatar badge
  const initials = contact.name ? Initials(contact.name) : "U";

  const formattedDate = contact.createdAt
    ? new Date(contact.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "Oct 24, 2023 - 14:32 UTC";

  return (
    <div className="p-6 rounded-md border border-border/80 bg-card space-y-6">
      {/* Sender Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground leading-tight">
              {contact.name}
            </h1>
            <a
              href={`mailto:${contact.email}`}
              className="text-xs text-muted-foreground hover:underline"
            >
              {contact.email}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
            {contact.subject}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Message Content */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground capitalize">
          {contact.subject}
        </h2>

        <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans space-y-3">
          {contact.message}
        </div>
      </div>
    </div>
  );
}
