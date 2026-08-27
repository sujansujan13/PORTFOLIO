"use client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

interface blogReqProps {
  category?: string;
  limit?: number;
  userId?: string;
  enabled?: boolean;
}

export const usePublicBlogs = (options?: blogReqProps) => {
  const { data: session } = authClient.useSession();
  const userIdGiven = Boolean(options && "userId" in options);
  const effectiveUserId = userIdGiven ? options!.userId : (session?.user?.id ?? "");

  return useQuery({
    ...trpc.blogs.getPublicBlogs.queryOptions({
      category: options?.category,
      limit: options?.limit ?? 20,
      userId: effectiveUserId ?? "",
    }),
    enabled: options?.enabled ?? true,
  });
};
