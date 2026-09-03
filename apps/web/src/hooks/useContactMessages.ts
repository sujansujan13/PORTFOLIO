import { trpc } from "@/utils/trpc";
import {
  Query,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { GetContactMessagesInput } from "@my-portfolio/api/schemas/contact/getContactMessage.schema";


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
      // Don't retry queries that fail with 404 (Not Found)
      retry: false,
    }),
  );
}

export function useDeleteSingleContact() {
  const queryClient = useQueryClient();
  return useMutation(
    trpc.contact.deleteSingleContact.mutationOptions({
      onSuccess: async (_, variables) => {
        const singleMessageKey = trpc.contact.getSingleContactMessage.queryKey({
          id: variables.id,
        });

        // Cancel any in-flight fetch for the deleted message
        await queryClient.cancelQueries({
          queryKey: singleMessageKey,
        });

        // Set query cache to undefined so active/mounted components don't hold deleted data
        queryClient.setQueryData(singleMessageKey, undefined);

        // Invalidate the contact list to reflect updated counts/list
        queryClient.invalidateQueries({
          queryKey: trpc.contact.getContactMessages.queryKey(),
        });
      },
    }),
  );
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation(
    trpc.contact.updateStatus.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: trpc.contact.getContactMessages.queryKey(),
        });

        // Refresh this specific message
        queryClient.invalidateQueries({
          queryKey: trpc.contact.getSingleContactMessage.queryKey({
            id: variables.id,
          }),
        });
      },
    }),
  );
}
