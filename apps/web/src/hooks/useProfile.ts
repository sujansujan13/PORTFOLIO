"use client";

import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UsePublicProfileOptions {
  userId?: string;
  enabled?: boolean;
}

interface UseProfileByIdOptions {
  enabled?: boolean;
}

/**
 * 1. Mutation hook to upsert (create or update) the user profile.
 *    Invalidates ALL profile queries (both public and dashboard) on success.
 */
export function useUpsertProfile() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.profile.upsertProfile.mutationOptions({
      onSuccess: () => {
        // Invalidate all profile queries (both public and dashboard) on success.
        queryClient.invalidateQueries({
          queryKey: trpc.profile.getPublicProfile.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.profile.getProfileByUserId.queryKey(),
        });
      },
    }),
  );
}

/**
 * 2. Public profile hook for guest visitors on landing (/) and /about pages.
 */
export function usePublicProfile(options?: UsePublicProfileOptions) {
  return useQuery({
    ...trpc.profile.getPublicProfile.queryOptions(
      options?.userId ? { userId: options.userId } : undefined,
    ),
    enabled: options?.enabled ?? true,
  });
}

/**
 * 3. Authenticated profile hook for populating the admin dashboard edit form.
 */
export function useProfileById(options?: UseProfileByIdOptions) {
  return useQuery({
    ...trpc.profile.getProfileByUserId.queryOptions(undefined, {
      staleTime: 30_000,
      retry: false,
    }),
    enabled: options?.enabled ?? true,
  });
}
