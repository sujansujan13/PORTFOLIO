"use client";

import React, { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BlogCard, type BlogPost } from "./blog-card";

interface BlogFeedProps {
  posts: BlogPost[];
}

const FILTER_CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "react", label: "React" },
  { slug: "node.js", label: "Node.js" },
  { slug: "system-design", label: "System Design" },
  { slug: "devops", label: "DevOps" },
];

export function BlogFeed({ posts }: { posts: BlogPost[] }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [, startTransition] = useTransition();

  // Dynamic conditional reduction filtering execution loop logic pass
  const filteredPosts = posts.filter(
    (post) =>
      activeFilter === "all" || post.category.toLowerCase() === activeFilter,
  );

  const handleFilterChange = (slug: string) => {
    // Concurrent UI transition wrapper optimization pattern to preserve layout thread responsiveness
    startTransition(() => {
      setActiveFilter(slug);
    });
  };

  return (
    <div className="space-y-12">
      {/* Section Filter Horizontal Bar Track Block */}
      <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2.5 pb-4 border-b border-b-gray-700">
        {FILTER_CATEGORIES.map((category) => {
          const isActive = activeFilter === category.slug;
          return (
            <button
              key={category.slug}
              onClick={() => handleFilterChange(category.slug)}
              className={`px-4 py-2 text-xs font-mono font-bold rounded-lg uppercase tracking-wider transition-all duration-150 border cursor-pointer ${
                isActive
                  ? "bg-amber-500 text-neutral-950 border-amber-500 font-black shadow-md hover:scale-105 transition-all"
                  : "bg-card text-muted-foreground border-border hover:border-muted-foreground/40 hover:text-foreground"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Grid Execution Block layout context mappings handling layout transitions cleanly */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
