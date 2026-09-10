"use client";
import { usePublicBlogs } from "@/hooks/usePublicBlogs";
import type { PublicBlogCard } from "@my-portfolio/api/schemas/blogs/blog.schema";
import { useMemo, useState } from "react";
import { BlogFeed } from "./blog-feed";

import { NewsletterBox } from "./newsLetter-box";
import { useGetCategories } from "@/hooks/useCategory";

const FILTER_CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "react", label: "React" },
  { slug: "node.js", label: "Node.js" },
  { slug: "system-design", label: "System Design" },
  { slug: "devops", label: "DevOps" },
];

export default function Blogclient() {
  const categoriesQuery = useGetCategories({ type: "blog" });
  const categories = useMemo(() => {
    const rawCategories = categoriesQuery.data || [];
    const formatted = rawCategories.map((cat) => ({
      slug: cat.slug,
      label: cat.name,
    }));
    return [{ slug: "All", label: "All Builds" }, ...formatted];
  }, [categoriesQuery.data]);

  const [activeCategory, setActiveCategory] = useState("All");
  const blogsQuery = usePublicBlogs({ category: activeCategory, limit: 20 });

  const blogs = useMemo(() => {
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
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          isLoading={blogsQuery.isPending}
        />
      </section>

      <NewsletterBox />
    </div>
  );
}
