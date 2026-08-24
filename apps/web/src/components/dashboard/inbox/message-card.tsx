"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MailOpen,
  Archive,
  Reply,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { ContactMessage } from "./inbox-client-page";
import Link from "next/link";

interface MessageCardProps {
  message: ContactMessage;
  onToggleRead: (message: ContactMessage) => void;
  onArchive: (id: string) => void;
}

export function MessageCard({
  message,
  onToggleRead,
  onArchive,
}: MessageCardProps) {
  const isUnread = message.status === "unread";

  // Subject Pill Styling
  const subjectStyles: Record<ContactMessage["subject"], string> = {
    collaboration: "bg-primary/10 text-primary border-primary/20",
    internship: "bg-accent text-accent-foreground border-border",
    general: "bg-muted text-muted-foreground border-border",
  };

  // Helper for 2-letter Avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Date Formatting
  const formattedDate = new Date(message.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className={`relative group bg-card border transition-all duration-200 p-4 rounded-sm ${
        isUnread
          ? "border-l-4 border-l-primary border-t-border border-r-border border-b-border bg-card/90"
          : "border-border/70 opacity-90 hover:opacity-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Avatar & Details */}
        <Link
          href={`/dashboard/inbox/${message.id}`}
          className="flex items-start gap-3.5 min-w-0"
        >
          {/* Avatar Circle */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-input/60 border border-border flex items-center justify-center font-bold text-xs text-foreground tracking-wider">
              {getInitials(message.name)}
            </div>
            {isUnread && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-card" />
            )}
          </div>

          {/* Details & Body */}
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-foreground truncate">
                {message.name}
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground/80">
                &lt;{message.email}&gt;
              </span>
              <span className="text-[11px] font-mono text-muted-foreground/60 ml-auto sm:ml-0">
                {formattedDate}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border uppercase rounded-none ${
                  subjectStyles[message.subject]
                }`}
              >
                {message.subject}
              </span>

              {/* Email Delivery Status Badge */}
              {message.emailNotifications?.status === "failed" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-destructive">
                  <AlertCircle className="w-3 h-3" /> Email Failed
                </span>
              )}
              {message.emailNotifications?.status === "sent" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground/70">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Sent
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed pt-0.5">
              {message.message}
            </p>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 self-end sm:self-center shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onToggleRead(message)}
            title={isUnread ? "Mark as Read" : "Mark as Unread"}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-none cursor-pointer"
          >
            {isUnread ? (
              <MailOpen className="w-4 h-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </button>

          <a
            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
            title="Reply via Email"
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-none cursor-pointer"
          >
            <Reply className="w-4 h-4" />
          </a>

          {message.status !== "archived" && (
            <button
              type="button"
              onClick={() => onArchive(message.id)}
              title="Archive Message"
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-none cursor-pointer"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
