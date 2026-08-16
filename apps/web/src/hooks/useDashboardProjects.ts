import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface UseDashboardProjectsOptions {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export function useDashboardProjects(options?: UseDashboardProjectsOptions) {
  return useQuery(
    trpc.projects.getDashboardProjects.queryOptions({
      search: options?.search,
      category: options?.category,
      page: options?.page ?? 1,
      limit: options?.limit ?? 10,
    }),
  );
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.createProject.mutationOptions({
      onSuccess: () => {
        // Refresh all dashboard project lists.
        queryClient.invalidateQueries({
          queryKey: trpc.projects.getDashboardProjects.queryKey(),
        });
      },
    }),
  );
}

export function useDashboardProject(id?: string) {
  return useQuery({
    ...trpc.projects.getDashboardProjectById.queryOptions({
      id: id ?? "",
    }),
    enabled: Boolean(id),
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.updateProject.mutationOptions({
      onSuccess: (_data, variables) => {
        // Refresh all dashboard project lists.
        queryClient.invalidateQueries({
          queryKey: trpc.projects.getDashboardProjects.queryKey(),
        });

        // Refresh the specific project that was updated.
        queryClient.invalidateQueries({
          queryKey: trpc.projects.getDashboardProjectById.queryKey({
            id: variables.id,
          }),
        });
      },
    }),
  );
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.deleteProject.mutationOptions({
      onSuccess: (_data, variables) => {
        // Refresh all dashboard project lists.
        queryClient.invalidateQueries({
          queryKey: trpc.projects.getDashboardProjects.queryKey(),
        });

        // Remove the deleted project from the individual cache.
        queryClient.removeQueries({
          queryKey: trpc.projects.getDashboardProjectById.queryKey({
            id: variables.id,
          }),
        });
      },
    }),
  );
}

export function useDeleteManyProjects() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.deleteManyProjects.mutationOptions({
      onSuccess: () => {
        // Refresh all dashboard project lists.
        queryClient.invalidateQueries({
          queryKey: trpc.projects.getDashboardProjects.queryKey(),
        });

        // Any cached individual project may have been deleted.
        queryClient.invalidateQueries({
          queryKey: trpc.projects.getDashboardProjectById.queryKey(),
        });
      },
    }),
  );
}
