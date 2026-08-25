// components/contact/ContactHeaderActions.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Trash2 } from "lucide-react";

interface ContactHeaderActionsProps {
  email?: string;
  subject?: string;
  onDelete?: () => void;
}

export function ContactHeaderActions({
  email,
  subject,
  onDelete,
}: ContactHeaderActionsProps) {
  // Construct Gmail compose deep link
  const gmailComposeUrl =
    `https://mail.google.com/mail/?view=cm` +
    `&to=${encodeURIComponent(email as string)}` +
    `&su=${encodeURIComponent(`Re: ${subject}`)}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      {/* Back Button */}
      <Link
        title="Back to Index"
        href={"/dashboard/inbox"}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border border-border/80 bg-card/50 text-foreground hover:bg-accent/80 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <a
          href={gmailComposeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-md cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5" />
          Reply via Gmail
        </a>

        <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border border-destructive/30 text-destructive bg-destructive/10 hover:bg-destructive hover:text-white transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
