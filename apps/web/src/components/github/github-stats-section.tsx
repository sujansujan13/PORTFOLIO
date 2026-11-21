"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa6";
import {
  Star,
  GitFork,
  BookOpen,
  Users,
  ExternalLink,
  Sparkles,
  Code2,
} from "lucide-react";
import { useGitHubStats } from "@/hooks/useGitHubStats";

interface GitHubStatsSectionProps {
  username?: string;
  className?: string;
}

export function GitHubStatsSection({
  username = "sujansujan13",
  className = "",
}: GitHubStatsSectionProps) {
  const { data: stats, isLoading, isError } = useGitHubStats({ username });

  if (isLoading) {
    return (
      <div className={`w-full max-w-6xl mx-auto py-12 px-4 ${className}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-muted rounded-lg mx-auto mb-8" />
          <div className="h-40 bg-card rounded-2xl border border-border p-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-card rounded-xl border border-border p-4"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return null; // Silently fallback if GitHub API rate limited or unreachable
  }

  const { user, metrics, languages, topRepos } = stats;

  return (
    <section className={`w-full max-w-6xl mx-auto py-12 px-4 ${className}`}>
      {/* Section Header */}
      <div className="text-center mb-10 space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Live GitHub Activity
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground"
        >
          Code Activity & Open Source
        </motion.h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Real-time metrics, repositories, and technical stack breakdown automatically fetched from GitHub.
        </p>
      </div>

      {/* Main Profile & Stats Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 sm:p-8 backdrop-blur-xl shadow-xl mb-8 group text-card-foreground"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border">
          {/* User Info Header */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <img
              src={user.avatarUrl}
              alt={user.name || user.username}
              className="w-16 h-16 rounded-full border-2 border-emerald-500/40 shadow-md object-cover"
            />
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                {user.name || user.username}
                <a
                  href={user.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-emerald-500 transition-colors"
                  title="View GitHub Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                @{user.username}
              </p>
              {user.bio && (
                <p className="text-xs text-muted-foreground mt-1 max-w-md">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full md:w-auto">
            <div className="bg-muted/50 border border-border/80 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                Repos
              </div>
              <span className="text-lg font-bold text-foreground">
                {metrics.totalRepos}
              </span>
            </div>

            <div className="bg-muted/50 border border-border/80 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                Stars
              </div>
              <span className="text-lg font-bold text-foreground">
                {metrics.totalStars}
              </span>
            </div>

            <div className="bg-muted/50 border border-border/80 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Followers
              </div>
              <span className="text-lg font-bold text-foreground">
                {user.followers}
              </span>
            </div>
          </div>
        </div>

        {/* Language Breakdown Bar */}
        {languages.length > 0 && (
          <div className="relative z-10 pt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 font-medium">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-500" />
                Primary Languages Across Repositories
              </span>
              <span>{languages.length} Languages</span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-muted p-0.5 border border-border/50">
              {languages.map((lang) => (
                <div
                  key={lang.language}
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                  className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-85"
                  title={`${lang.language}: ${lang.percentage}%`}
                />
              ))}
            </div>

            {/* Language Legend */}
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-1">
              {languages.slice(0, 6).map((lang) => (
                <div
                  key={lang.language}
                  className="flex items-center gap-1.5 text-xs text-foreground font-medium"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span>{lang.language}</span>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    ({lang.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Top Repositories Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FaGithub className="w-5 h-5 text-emerald-500" />
          Featured GitHub Repositories
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topRepos.map((repo, idx) => (
            <motion.a
              key={repo.name}
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group relative overflow-hidden rounded-xl bg-card border border-border p-5 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-base font-bold text-foreground group-hover:text-emerald-500 transition-colors flex items-center gap-1.5 truncate">
                    {repo.name}
                  </h4>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {repo.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/80">
                {repo.language ? (
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {repo.language}
                  </span>
                ) : (
                  <span className="text-muted-foreground">General</span>
                )}

                <div className="flex items-center gap-3">
                  {repo.stars > 0 && (
                    <span className="flex items-center gap-1 text-foreground">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      {repo.stars}
                    </span>
                  )}
                  {repo.forks > 0 && (
                    <span className="flex items-center gap-1 text-foreground">
                      <GitFork className="w-3.5 h-3.5 text-muted-foreground" />
                      {repo.forks}
                    </span>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
