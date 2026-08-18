import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

interface useDashboardTimelineProps {
  search?: string;
  type?: "all" | "education" | "experience";
}

export function useDashboardTimeline(options?: useDashboardTimelineProps) {
  return useQuery(
    trpc.timeline.getDashboardTimeline.queryOptions({
      search: options?.search,
      type: options?.type,
    }),
  );
}

export function useCreateTimline() {
  const queryClient = useQueryClient();
  return useMutation(
    trpc.timeline.createTimeline.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.timeline.getDashboardTimeline.queryKey(),
        });
      },
    }),
  );
}

export function useGetDashboardTimelineById(id?: string) {
  return useQuery({
    ...trpc.timeline.getDashboardTimelineById.queryOptions({
      id: id ?? "",
    }),
    enabled: !!id,
  });
}

export function useUpdateTimeline() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.timeline.updateTimeline.mutationOptions({
      onSuccess: (_data, variables) => {
        // Refresh the dashboard timeline list.
        queryClient.invalidateQueries({
          queryKey: trpc.timeline.getDashboardTimeline.queryKey(),
        });

        // Refresh the currently edited timeline item.
        queryClient.invalidateQueries({
          queryKey: trpc.timeline.getDashboardTimelineById.queryKey({
            id: variables.id,
          }),
        });
      },
    }),
  );
}

export function useDeleteTimeline() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.timeline.deleteTimeline.mutationOptions({
      onSuccess: (_data, variables) => {
        // Refresh the dashboard timeline list.
        queryClient.invalidateQueries({
          queryKey: trpc.timeline.getDashboardTimeline.queryKey(),
        });

        // Remove the deleted timeline item from the cache.
        queryClient.removeQueries({
          queryKey: trpc.timeline.getDashboardTimelineById.queryKey({
            id: variables.id,
          }),
        });
      },
    }),
  );
}
