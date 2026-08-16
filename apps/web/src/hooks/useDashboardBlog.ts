"use client";

import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface DashboardBlogOptions {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export function useDashboardBlog(options?: DashboardBlogOptions) {
  return useQuery(
    trpc.blogs.getDashboardBlogs.queryOptions({
      search: options?.search,
      page: options?.page ?? 1,
      limit: options?.limit ?? 10,
      category: options?.category,
    }),
  );
}

export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogs.createBlog.mutationOptions({
      onSuccess: () => {
        // Refresh dashboard blog lists.
        queryClient.invalidateQueries({
          queryKey: trpc.blogs.getDashboardBlogs.queryKey(),
        });
      },
    }),
  );
}

export function useDashboardBlogById(id?: string) {
  return useQuery({
    ...trpc.blogs.getDashboardBlogById.queryOptions({
      id: id ?? "",
    }),
    enabled: Boolean(id),
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogs.updateBlog.mutationOptions({
      onSuccess: (_data, variables) => {
        // Refresh dashboard blog lists.
        queryClient.invalidateQueries({
          queryKey: trpc.blogs.getDashboardBlogs.queryKey(),
        });

        // Refresh the specific blog that was updated.
        queryClient.invalidateQueries({
          queryKey: trpc.blogs.getDashboardBlogById.queryKey({
            id: variables.id,
          }),
        });
      },
    }),
  );
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogs.deleteBlog.mutationOptions({
      onSuccess: (_data, variables) => {
        // Refresh dashboard blog lists.
        queryClient.invalidateQueries({
          queryKey: trpc.blogs.getDashboardBlogs.queryKey(),
        });

        // Remove the deleted blog from the individual cache.
        queryClient.removeQueries({
          queryKey: trpc.blogs.getDashboardBlogById.queryKey({
            id: variables.id,
          }),
        });
      },
    }),
  );
}

export function useDeleteMultipleBlogs() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.blogs.deleteMultiplBlogs.mutationOptions({
      onSuccess: () => {
        // Refresh all dashboard blog lists.
        queryClient.invalidateQueries({
          queryKey: trpc.blogs.getDashboardBlogs.queryKey(),
        });

        // Individual blog caches may also contain deleted blogs.
        queryClient.invalidateQueries({
          queryKey: trpc.blogs.getDashboardBlogById.queryKey(),
        });
      },
    }),
  );
}
