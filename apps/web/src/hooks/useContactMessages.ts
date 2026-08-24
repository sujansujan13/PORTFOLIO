import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GetContactMessagesInput } from "@my-portfolio/api/schemas/Contact/getContactMessage.schema";

export function useContactMessages(options: GetContactMessagesInput) {
  return useQuery(trpc.contact.getContactMessages.queryOptions(options));
}

export function useUpdateReadStatus() {
  const queryClient = useQueryClient();
  return useMutation(
    trpc.contact.updateContactMessageReadStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.contact.getContactMessages.queryKey(),
        });
      },
    }),
  );
}

export function useArchiveMessages() {
  const queryClient = useQueryClient();
  return useMutation(
    trpc.contact.archiveContactMessage.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.contact.getContactMessages.queryKey(),
        });
      },
    }),
  );
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation(
    trpc.contact.markAllRead.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.contact.getContactMessages.queryKey(),
        });
      },
    }),
  );
}

export function useContactMessageById(options: { id: string }) {
  return useQuery(
    trpc.contact.getSingleContactMessage.queryOptions(options, {
      // How long should cached data be considered fresh?
      staleTime: 30_000,
      // How long should unused/inactive cached data remain in memory?
      gcTime: 5 * 60_000,
    }),
  );
}
