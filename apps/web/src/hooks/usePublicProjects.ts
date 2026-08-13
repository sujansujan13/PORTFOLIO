"use client";

import { useQuery } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";

import { trpc } from "@/utils/trpc";

interface UsePublicProjectsOptions {
  category?: string;
  limit?: number;
  featured?: boolean;
}

export function usePublicProjects(options?: UsePublicProjectsOptions) {
  return useQuery(
    trpc.projects.getPublicProjects.queryOptions({
      category: options?.category,
      limit: options?.limit ?? 50,
      featured: options?.featured,
    }),
  );
}

// import type { AppRouter } from "@my-portfolio/api/routers/index";
// type RouterOutput = inferRouterOutputs<AppRouter>;
// export type PublicProject =
// RouterOutput["projects"]["getPublicProjects"][number];

// what if tanStack query is not used
// ("use client");
// import { useEffect, useState } from "react";
// import { trpc } from "@/utils/trpc";

// interface UsePublicProjectsOptions {
//   category?: string;
//   limit?: number;
// }

// export function usePublicProjects(options?: UsePublicProjectsOptions) {
//   const [data, setData] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isError, setIsError] = useState(false);

//   useEffect(() => {
//     async function fetchProjects() {
//       try {
//         setIsLoading(true);

//         const result = await trpc.projects.getPublicProjects.query({
//           category: options?.category,
//           limit: options?.limit ?? 50,
//         });

//         setData(result);
//       } catch {
//         setIsError(true);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchProjects();
//   }, [options?.category, options?.limit]);

//   return {
//     data,
//     isLoading,
//     isError,
//   };
// }
