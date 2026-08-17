"use client";
import { useRouter } from "next/navigation";
import TimelineFormClient from "./../shared/timeline-form-Client";
import type { TimelineFormValues } from "./../../../../schemas/timeline-form.schema";
import { useCreateTimline } from "@/hooks/useTimeline";
import { toast } from "sonner";

export default function TimelineNewClient() {
  const router = useRouter();
  const createTimeline = useCreateTimline();

  const defaultValues: TimelineFormValues = {
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    isPresent: false,
    description: "",
    type: "experience",
    publicAccess: true,
    tags: [],
  };

  const handleCreate = async (data: TimelineFormValues) => {
    try {
      await createTimeline.mutateAsync(data);

      toast.success("Timeline node created successfully");
      router.push("/dashboard/timeline");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create timeline node",
      );
    }
  };

  const handleSaveDraft = async (data: TimelineFormValues) => {
    try {
      await createTimeline.mutateAsync({
        ...data,
        publicAccess: false,
      });

      toast.success("Timeline node saved as draft successfully");
      router.push("/dashboard/timeline");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create timeline node",
      );
    }
  };

  return (
    <TimelineFormClient
      defaultValues={defaultValues}
      isEditing={false}
      isSubmitting={createTimeline.isPending}
      onSubmit={handleCreate}
      onSaveDraft={handleSaveDraft}
    />
  );
}
