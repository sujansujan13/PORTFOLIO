"use client";

import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

interface UseGitHubStatsOptions {
  username?: string;
  enabled?: boolean;
}

export function useGitHubStats(options?: UseGitHubStatsOptions) {
  return useQuery({
    ...trpc.github.getStats.queryOptions(
      options?.username ? { username: options.username } : undefined,
    ),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes client side
  });
}
