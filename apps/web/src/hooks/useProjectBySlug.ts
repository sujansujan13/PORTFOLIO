import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export function useProjectBySlug(slug?: string, userId?: string) {
  return useQuery(
    trpc.projects.getProjectBySlug.queryOptions(
      {
        slug: slug ?? "",
        userId: userId ?? ""
      },
      {
        enabled: Boolean(slug),
        staleTime: 1000 * 60 * 60,
      },
    ),
  );
}
