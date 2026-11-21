import { TRPCError } from "@trpc/server";

export interface GitHubStatsResponse {
  user: {
    username: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    publicRepos: number;
    followers: number;
    following: number;
    htmlUrl: string;
    createdAt: string;
  };
  metrics: {
    totalStars: number;
    totalForks: number;
    totalRepos: number;
  };
  languages: Array<{
    language: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  topRepos: Array<{
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    htmlUrl: string;
    updatedAt: string;
    topics: string[];
  }>;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Dart: "#00B4AB",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  PHP: "#4F5D95",
  Shell: "#89e051",
};

// Simple In-Memory Cache to prevent hitting GitHub API rate limits
const statsCache = new Map<
  string,
  { data: GitHubStatsResponse; timestamp: number }
>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Static Fallback Data for sujansujan13 if Rate Limited (60 req/hr IP limit)
const FALLBACK_STATS: GitHubStatsResponse = {
  user: {
    username: "sujansujan13",
    name: "Sujan Raj Pandey",
    avatarUrl: "https://avatars.githubusercontent.com/u/195405483?v=4",
    bio: "Full-Stack Developer | TypeScript, Next.js, Node.js & Monorepo Architectures",
    publicRepos: 17,
    followers: 1,
    following: 0,
    htmlUrl: "https://github.com/sujansujan13",
    createdAt: "2025-01-17T04:19:04Z",
  },
  metrics: {
    totalStars: 0,
    totalForks: 0,
    totalRepos: 17,
  },
  languages: [
    { language: "JavaScript", count: 7, percentage: 44, color: "#f1e05a" },
    { language: "TypeScript", count: 6, percentage: 38, color: "#3178c6" },
    { language: "HTML", count: 2, percentage: 12, color: "#e34c26" },
    { language: "CSS", count: 1, percentage: 6, color: "#563d7c" },
  ],
  topRepos: [
    {
      name: "PORTFOLIO",
      description:
        "Full-stack monorepo built with Next.js App Router, pnpm workspaces, custom API/DB packages, and dynamic admin timeline management.",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      htmlUrl: "https://github.com/sujansujan13/PORTFOLIO",
      updatedAt: "2026-09-10T08:11:33Z",
      topics: ["typescript", "nextjs", "monorepo"],
    },
    {
      name: "Zustand-learn-everything",
      description:
        "A comprehensive reference guide and practical implementation repository for Zustand state management in React & Next.js.",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      htmlUrl: "https://github.com/sujansujan13/Zustand-learn-everything",
      updatedAt: "2026-07-19T00:00:00Z",
      topics: ["zustand", "react", "typescript"],
    },
    {
      name: "ecommerce-mern-nextjs-fullStack",
      description:
        "Full-stack e-commerce platform built with Next.js, React, Node.js, Express, and MongoDB.",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      htmlUrl:
        "https://github.com/sujansujan13/ecommerce-mern-nextjs-fullStack",
      updatedAt: "2026-06-22T00:00:00Z",
      topics: ["nextjs", "mern", "ecommerce"],
    },
    {
      name: "NEXTJS-Auth-cloudinary-fullStack",
      description:
        "Full-stack Next.js application with authentication, MongoDB integration, and Cloudinary media uploading.",
      language: "TypeScript",
      stars: 0,
      forks: 0,
      htmlUrl:
        "https://github.com/sujansujan13/NEXTJS-Auth-cloudinary-fullStack",
      updatedAt: "2026-06-17T00:00:00Z",
      topics: ["nextjs", "auth", "cloudinary"],
    },
  ],
};

export async function fetchGitHubStats(
  username: string = "sujansujan13",
): Promise<GitHubStatsResponse> {
  const cleanUsername = username
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/\/$/, "")
    .trim();

  try {

    // Check in-memory cache first
    const cached = statsCache.get(cleanUsername);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    const headers: Record<string, string> = {
      "User-Agent": "MyPortfolio-App",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch user profile & repos in parallel
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${cleanUsername}`, { headers }),
      fetch(
        `https://api.github.com/users/${cleanUsername}/repos?sort=updated&per_page=100`,
        { headers },
      ),
    ]);

    // Handle rate limit (403) or not found gracefully
    if (userRes.status === 403 || userRes.status === 429) {
      console.warn(
        `GitHub API rate limit exceeded for ${cleanUsername}. Returning cached/fallback data.`,
      );
      if (cached) return cached.data;
      if (cleanUsername.toLowerCase() === "sujansujan13") return FALLBACK_STATS;
    }

    if (!userRes.ok) {
      if (cached) return cached.data;
      if (cleanUsername.toLowerCase() === "sujansujan13") return FALLBACK_STATS;
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `GitHub user '${cleanUsername}' not found`,
      });
    }

    const userData: any = await userRes.json();
    const reposData: any[] = reposRes.ok
      ? ((await reposRes.json()) as any[])
      : [];

    let totalStars = 0;
    let totalForks = 0;
    const languageCounts: Record<string, number> = {};

    const nonForkRepos = Array.isArray(reposData)
      ? reposData.filter((r: any) => !r.fork)
      : [];

    nonForkRepos.forEach((repo: any) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;

      if (repo.language) {
        languageCounts[repo.language] =
          (languageCounts[repo.language] || 0) + 1;
      }
    });

    // Compute language percentages
    const totalLangRepos = Object.values(languageCounts).reduce(
      (a, b) => a + b,
      0,
    );

    const languages = Object.entries(languageCounts)
      .map(([lang, count]) => ({
        language: lang,
        count,
        percentage: totalLangRepos
          ? Math.round((count / totalLangRepos) * 100)
          : 0,
        color: LANGUAGE_COLORS[lang] || "#8b949e",
      }))
      .sort((a, b) => b.count - a.count);

    // Filter top 6 repos (sorted by stars, then updated date)
    const topRepos = [...nonForkRepos]
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      })
      .slice(0, 6)
      .map((r: any) => ({
        name: r.name,
        description: r.description || null,
        language: r.language || null,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        htmlUrl: r.html_url,
        updatedAt: r.updated_at,
        topics: r.topics || [],
      }));

    const result: GitHubStatsResponse = {
      user: {
        username: userData.login,
        name: userData.name || null,
        avatarUrl: userData.avatar_url,
        bio: userData.bio || null,
        publicRepos: userData.public_repos || 0,
        followers: userData.followers || 0,
        following: userData.following || 0,
        htmlUrl: userData.html_url,
        createdAt: userData.created_at,
      },
      metrics: {
        totalStars,
        totalForks,
        totalRepos: nonForkRepos.length,
      },
      languages,
      topRepos,
    };

    // Store in cache
    statsCache.set(cleanUsername, { data: result, timestamp: Date.now() });

    return result;
  } catch (error: any) {
    console.error("Error fetching GitHub stats:", error);
    if (cleanUsername.toLowerCase() === "sujansujan13") return FALLBACK_STATS;
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error?.message || "Failed to fetch GitHub stats",
    });
  }
}
