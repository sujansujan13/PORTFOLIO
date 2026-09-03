"use client";

import React, { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BlogCard } from "./blog-card";
import type { PublicBlogCard } from "@my-portfolio/api/schemas/blogs/blog.schema";

import { p } from "framer-motion/client";

interface categoryType {
  slug: string;
  label: string;
}
interface BlogCardTypes {
  posts: PublicBlogCard[];
  categories: categoryType[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading: Boolean;
}

export function BlogFeed({
  posts,
  categories,
  activeCategory,
  onCategoryChange,
  isLoading,
}: BlogCardTypes) {
  return (
    <div className="space-y-12">
      {/* Section Filter Horizontal Bar Track Block */}
      <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2.5 pb-4 border-b border-b-gray-700">
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          return (
            <button
              key={category.slug}
              onClick={() => onCategoryChange(category.slug)}
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
      {isLoading ? (
        <p className="h-screen text-center font-serif font-semibold">
          Loading...
        </p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
