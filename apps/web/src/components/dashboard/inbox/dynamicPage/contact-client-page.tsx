"use client";
import {
  useContactMessageById,
  useDeleteSingleContact,
  useUpdateStatus,
} from "@/hooks/useContactMessages";
import React from "react";
import { ContactHeaderActions } from "./contact-header-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContactMessageContent } from "./contact-message-content";
import { ContactSidebar, type Status } from "./contact-sidebar";

interface ContactClientPageProps {
  id: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: "collaboration" | "internship" | "general";
  message: string;
  createdAt?: string;
}
export default function ContactClientPage({ id }: ContactClientPageProps) {
  const router = useRouter();
  const { data: Contact, isPending, isError } = useContactMessageById({ id });

  const deleteSingleContact = useDeleteSingleContact();

  const handleDelete = () => {
    deleteSingleContact.mutate(
      { id },
      {
        onSuccess: () => {
          router.push("/dashboard/inbox");
        },
        onError: () => {
          toast.error("Failed to delete message", {
            position: "top-center",
          });
        },
      },
    );
  };

  const updateStatus = useUpdateStatus();

  const handleStatusChange = (status: Status) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success(`Message marked as ${status}`, {
            position: "top-center",
          });
        },
        onError: () => {
          toast.error("Failed to update message status", {
            position: "top-center",
          });
        },
      },
    );
  };

  return (
    <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <ContactHeaderActions
        email={Contact?.email}
        subject={Contact?.subject}
        onDelete={handleDelete}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {" "}
          {isPending ? (
            <div>Loading...</div>
          ) : isError || !Contact ? (
            <div>Contact message not found.</div>
          ) : (
            <ContactMessageContent contact={Contact} />
          )}
        </div>
        <div className="lg:col-span-1">
          <ContactSidebar
            status={Contact?.status}
            onStatusChange={handleStatusChange}
            metadata={Contact?.metadata}
            emailNotifications={Contact?.emailNotifications}
            messageId={id}
          />
        </div>
      </div>
    </main>
  );
}
