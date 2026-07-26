"use client";

import React from "react";

import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import type { PublicBlogCard } from "@my-portfolio/api/schemas/blog.schema";

// Config maps category string tokens cleanly to Tailwind CSS v4 variables without database clutter
const CATEGORY_THEMES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  react: { bg: "bg-amber-500", text: "text-neutral-950", label: "React" },
  "node.js": { bg: "bg-gray-300", text: "text-primary", label: "Node.js" },
  "system-design": {
    bg: "bg-gray-100",
    text: "text-black",
    label: "System Design",
  },
  devops: { bg: "bg-gray-200", text: "text-red-500", label: "DevOps" },
};

export function BlogCard({ post }: { post: PublicBlogCard }) {
  const theme = CATEGORY_THEMES[post.category.toLowerCase()] || {
    bg: "bg-muted",
    text: "text-foreground",
    label: post.category,
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="group flex flex-col w-full bg-card border border-border transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/1 rounded-lg"
    >
      {/* Structural Aspect Ratio Media Slot Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border rounded-t-lg">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          loading="lazy"
          className="w-full h-full object-cover transform scale-100 transition-transform duration-700 ease-out group-hover:scale-103"
        />

        {/* Absolute Badging Node Layout - Zero Radius Variant applied explicitly */}
        <span
          className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider ${theme.bg} ${theme.text}`}
        >
          {theme.label}
        </span>
      </div>

      {/* Meta Structural Information Area Element */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        </div>

        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-black tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary leading-tight">
            <Link
              href={`/blog/${post.slug}` as Route}
              className="focus:outline-none"
            >
              {post.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.description}
          </p>
        </div>

        {/* Read Action Trigger Row Node */}
        <div className="pt-2 border-t border-border/40">
          <Link
            href={`/blog/${post.slug}` as Route}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 transition-colors duration-150 group/btn"
          >
            <span>Read Article</span>
            {/* Horizontal micro-translation animation logic handled over UI events */}
            <ArrowRight className="h-3.5 w-3.5 transform transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
