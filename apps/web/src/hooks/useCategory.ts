import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetCategories(options?: { type: "blog" | "project" }) {
  return useQuery(
    trpc.category.getCategories.queryOptions({
      type: options?.type,
    }),
  );
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.category.createCategory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.category.getCategories.queryKey(),
        });
      },
    }),
  );
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.category.updateCategory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.category.getCategories.queryKey(),
        });
      },
    }),
  );
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.category.deleteCategory.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.category.getCategories.queryKey(),
        });
      },
    }),
  );
}
