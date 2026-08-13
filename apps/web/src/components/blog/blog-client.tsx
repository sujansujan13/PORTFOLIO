"use client";
import { usePublicBlogs } from "@/hooks/usePublicBlogs";
import type { PublicBlogCard } from "@my-portfolio/api/schemas/Blogs/blog.schema";
import React, { useMemo, useState } from "react";
import { BlogFeed } from "./blog-feed";
import { div } from "framer-motion/client";
import { NewsletterBox } from "./newsLetter-box";

const FILTER_CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "react", label: "React" },
  { slug: "node.js", label: "Node.js" },
  { slug: "system-design", label: "System Design" },
  { slug: "devops", label: "DevOps" },
];

export default function Blogclient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const blogsQuery = usePublicBlogs({ category: activeCategory, limit: 20 });

  const blogs = useMemo<PublicBlogCard[]>(() => {
    return blogsQuery.data ?? [];
  }, [blogsQuery.data]);

  if (blogsQuery.isError) {
    return (
      <p className="text-red-400 font-serif font-semibold">
        Could not find blogs
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-20">
      <section aria-label="articles feed grid">
        <BlogFeed
          posts={blogs}
          categories={FILTER_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          isLoading={blogsQuery.isPending}
        />
      </section>

      <NewsletterBox />
    </div>
  );
}
