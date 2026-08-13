"use client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export function useBlogBySlug(slug: string) {
  return useQuery(
    trpc.blogs.getBlogBySlug.queryOptions(
      { slug },
      {
        enabled: Boolean(slug),
        staleTime: 1000 * 60 * 60, //1 hour
      },
    ),
  );
}

//  enabled: Boolean(slug),
//
// If slug is an empty string (""), don't make the request.
// If slug has a value, fetch the project.
