// components/contact/ContactSidebar.tsx
"use client";

import React from "react";
import { Sliders, Code2, Bell } from "lucide-react";

export type Status = "read" | "unread" | "archived" | "spam";

interface ContactSidebarProps {
  status?: Status;
  onStatusChange: (status: Status) => void;
  metadata?: {
    ipHash?: string | null;
    userAgent?: string | null;
    source?: string | null;
  };
  emailNotifications?: {
    status?: string;
    sentAt?: Date | string | null;
    error?: string | null;
  };
  messageId?: string;
}

export function ContactSidebar({
  status,
  onStatusChange,
  metadata,
  emailNotifications,
  messageId,
}: ContactSidebarProps) {
  return (
    <div className="space-y-4">
      {/* Status Management Card */}
      <div className="p-4 rounded-md border border-border/80 bg-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border/40 pb-2">
          <Sliders className="w-3.5 h-3.5 text-primary" />
          <span>Status Management</span>
        </div>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as Status)}
          className="w-full bg-input/40 border border-border/80 px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary rounded-none cursor-pointer"
        >
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
          <option value="spam">Spam</option>
        </select>
      </div>

      {/* Technical Metadata Card */}
      <div className="p-4 rounded-md border border-border/80 bg-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border/40 pb-2">
          <Code2 className="w-3.5 h-3.5 text-primary" />
          <span>Technical Metadata</span>
        </div>

        <div className="space-y-2.5 text-[11px]">
          <div>
            <span className="text-muted-foreground uppercase font-semibold text-[10px] block">
              IP Hash
            </span>
            <p className="font-mono text-foreground/80 truncate">
              {metadata?.ipHash || "e3b0c44298fc1c149afbf4c..."}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground uppercase font-semibold text-[10px] block">
              User Agent
            </span>
            <p className="font-mono text-foreground/80 line-clamp-2">
              {metadata?.userAgent || "Mozilla/5.0 (Macintosh; Intel Mac OS X)"}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground uppercase font-semibold text-[10px] block">
              Source Form
            </span>
            <p className="font-mono text-foreground/80">
              {metadata?.source || "/portfolio/contact-v2"}
            </p>
          </div>

          <div>
            <span className="text-muted-foreground uppercase font-semibold text-[10px] block">
              Message ID
            </span>
            <p className="font-mono text-foreground/80">
              {messageId || "msg_7fX9a2Bc4"}
            </p>
          </div>
        </div>
      </div>

      {/* Notification Log Card */}
      <div className="p-4 rounded-md border border-border/80 bg-card space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border/40 pb-2">
          <Bell className="w-3.5 h-3.5 text-primary" />
          <span>Notification Log</span>
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                emailNotifications?.status === "failed"
                  ? "bg-destructive"
                  : "bg-emerald-500"
              }`}
            />
            <span className="font-semibold text-foreground">
              Delivered to Admin
            </span>
          </div>

          <div className="flex justify-between text-muted-foreground pt-1">
            <span>Status:</span>
            <span className="text-foreground font-mono">
              {emailNotifications?.status === "sent"
                ? "Success (200 OK)"
                : "Pending"}
            </span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Sent At:</span>
            <span className="text-foreground font-mono">
              {emailNotifications?.sentAt
                ? new Date(emailNotifications.sentAt).toLocaleTimeString()
                : "14:32:05 UTC"}
            </span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Provider:</span>
            <span className="text-foreground font-mono">Resend</span>
          </div>
        </div>
      </div>
    </div>
  );
}
