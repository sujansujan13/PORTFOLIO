import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

interface getPublicTimelineProps {
  type?: "education" | "experience";
  limit?: number;
}
export function useTimeline(options?: getPublicTimelineProps) {
  return useQuery(
    trpc.timeline.getPublicTimeline.queryOptions({
      type: options?.type,
      limit: options?.limit ?? 10,
    }),
  );
}
