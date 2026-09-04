"use client";

import React, { useMemo, useState } from "react";
import { usePublicBlogs } from "@/hooks/usePublicBlogs";
import { useGetCategories } from "@/hooks/useCategory";
import { BlogFeed } from "./blog-feed";
import { NewsletterBox } from "./newsLetter-box";

export default function Blogclient() {
  const [activeCategory, setActiveCategory] = useState("all");

  const categoriesQuery = useGetCategories({ type: "blog" });
  const blogsQuery = usePublicBlogs({ category: activeCategory, limit: 20 });

  // 1. Format dynamic categories ({ slug, label }) with an "All" default tab
  const categories = useMemo(() => {
    const rawCategories = categoriesQuery.data || [];
    const formatted = rawCategories.map((cat) => ({
      slug: cat.slug,
      label: cat.name,
    }));

    return [{ slug: "all", label: "All" }, ...formatted];
  }, [categoriesQuery.data]);

  const blogs = useMemo(() => {
    return blogsQuery.data ?? [];
  }, [blogsQuery.data]);

  const isLoading = blogsQuery.isPending || categoriesQuery.isPending;
  const isError = blogsQuery.isError || categoriesQuery.isError;

  if (isError) {
    return (
      <p className="text-center py-12 text-sm text-red-400 font-serif font-semibold">
        Could not find blogs
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-20">
      <section aria-label="articles feed grid">
        <BlogFeed
          posts={blogs}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          isLoading={isLoading}
        />
      </section>

      <NewsletterBox />
    </div>
  );
}

