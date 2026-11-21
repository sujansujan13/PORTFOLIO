import z from "zod";
import { publicProcedure, router } from "..";
import { fetchGitHubStats } from "../services/github.service";
import { getPublicProfile } from "../services/profile.service";

export const githubRouter = router({
  getStats: publicProcedure
    .input(
      z
        .object({
          username: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      let targetUsername = input?.username;

      // If no explicit username passed, try to retrieve from public profile's githubUrl
      if (!targetUsername) {
        try {
          const profile = await getPublicProfile();
          if (profile?.githubUrl) {
            targetUsername = profile.githubUrl;
          }
        } catch {
          // Fallback to default
        }
      }

      return fetchGitHubStats(targetUsername || "sujansujan13");
    }),
});
