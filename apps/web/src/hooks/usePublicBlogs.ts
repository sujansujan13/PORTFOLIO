"use client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

interface blogReqProps {
  category?: string;
  limit?: number;
}

export const usePublicBlogs = (options?: blogReqProps) => {
  return useQuery(
    trpc.blogs.getPublicBlogs.queryOptions({
      category: options?.category,
      limit: options?.limit ?? 20,
    }),
  );
};
