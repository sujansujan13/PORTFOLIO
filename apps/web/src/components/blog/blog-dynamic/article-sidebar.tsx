"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Share2, Bookmark } from "lucide-react";
import type { Route } from "next";
import Image from "next/image";

interface TocItem {
  id: string;
  label: string;
}

interface RelatedPost {
  title: string;
  category: string;
  slug: string;
  image: string;
}

interface SidebarProps {
  toc: TocItem[];
  relatedPosts: RelatedPost[];
}

export function ArticleSidebar({ toc, relatedPosts }: SidebarProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Smooth layout scrolling mapping engine tracking anchor parameters
  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <div className="space-y-10 lg:sticky lg:top-24">
      {/* 1. TABLE OF CONTENTS SYSTEM BOUNDARY */}
      <nav
        className="border border-border p-6 bg-card space-y-4 rounded-lg"
        aria-label="Table of contents mapping tracks"
      >
        <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-foreground">
          Contents
        </h3>
        <ul className="space-y-3 text-xs sm:text-sm">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleScrollToSection(e, item.id)}
                className="block text-accent-foreground hover:text-primary transition-colors duration-200 font-medium tracking-tight leading-snug"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <hr className="border-t border-border/60 my-4" />

        {/* Action Interaction Toolset Rows */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="p-2.5 border border-border text-foreground hover:bg-muted hover:border-muted-foreground/30 transition-all duration-200 cursor-pointer flex items-center justify-center bg-background rounded-full"
            title="Copy entry verification path share token"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2.5 border transition-all duration-200 cursor-pointer flex items-center justify-center bg-background rounded-full ${
              isBookmarked
                ? "border-amber-500 text-amber-500 bg-amber-500/5"
                : "border-border text-foreground hover:bg-muted hover:border-muted-foreground/30"
            }`}
            title="Toggle article persistence state bookmark"
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? "fill-amber-500" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* 2. RELATED MODULE ARTICLES CONTEXT LINK LIST */}
      <div className="space-y-4">
        <h3 className="text-lg font-mono font-bold uppercase tracking-wider text-foreground">
          Related Posts
        </h3>
        <div className="flex flex-col gap-4">
          {relatedPosts.map((post) => (
            <motion.div
              key={post.slug}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="group flex flex-col bg-card border border-border p-4 space-y-3 hover:border-primary/40 transition-colors duration-200 rounded-lg"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted border border-border/40 ">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  unoptimized
                  className="w-full h-full object-cover transform scale-100 transition-transform duration-500 group-hover:scale-102"
                  loading="lazy"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500">
                  {post.category}
                </span>
                <h4 className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-150 line-clamp-2">
                  <Link href={`/blog/${post.slug}` as Route}>{post.title}</Link>
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
