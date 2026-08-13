import { trpc, queryClient } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface useDashboardProjectsOptions {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
}

export function useDashboardProjects(options?: useDashboardProjectsOptions) {
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
        queryClient.invalidateQueries();
      },
    }),
  );
}

export function useDashboardProject(id: string) {
  return useQuery(trpc.projects.getDashboardProjectById.queryOptions({ id }));
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.updateProject.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }),
  );
}

export function useDeleteProject() {
  return useMutation(
    trpc.projects.deleteProject.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }),
  );
}

export function useDeleteManyProjects() {
  return useMutation(
    trpc.projects.deleteManyProjects.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }),
  );
}
