"use client";
import React from "react";
import { Clock } from "lucide-react";
import { ArticleSidebar } from "@/components/blog/blog-dynamic/article-sidebar";
import blogArticle from "@/data/blog-article.json";
import Image from "next/image";
import { calculateReadingTime } from "@/utils/calculateReadingTime";
import { useBlogBySlug } from "@/hooks/useBlogBySlug";
import { TiptapRenderer } from "./tiptap-renderer";

export default function BlogDynamicClient({ slug }: { slug: string }) {
  const blogQuery = useBlogBySlug(slug);

  if (blogQuery.isPending) {
    return <p>Loading Article...</p>;
  }

  if (blogQuery.isError) {
    return <p>Article Not Found</p>;
  }

  const blog = blogQuery.data;
  const readingTime = calculateReadingTime(blog.body);

  return (
    <main className="w-full min-h-screen bg-background text-foreground selection:bg-primary/20 py-12 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-30">
      <article className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* HEADER INFORMATION LAYOUT BAR SEGMENT */}
        <header className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 bg-amber-500 text-neutral-950 font-black uppercase tracking-wider rounded-lg">
              {blog.category}
            </span>
            <div className="flex items-center gap-1.5 text-accent-foreground uppercase tracking-wide font-bold">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl  font-black tracking-tight text-foreground leading-none">
            {blog.title}
          </h1>

          {/* Identity Author Node Badge Section Frame */}
          <div className="flex items-center gap-3 pt-3">
            <div className="h-15 w-15 overflow-hidden bg-muted border border-primary shrink-0 rounded-full">
              <Image
                src={blog.author.avatar}
                alt={blog.author?.name}
                className="h-full w-full object-cover rounded-full"
                width={90}
                unoptimized
                height={100}
              />
              <div className="absolute inset-0 bg-linear-to-tr from-black/20 via-transparent to-white/10" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-black tracking-tight text-foreground">
                {blog.author?.name}
              </p>
              <p className=" text-xs font-mono font-medium text-muted-foreground">
                <span className="text-primary">{blog.author?.role}</span>
                <span>•{blog.publishedAt}</span>
              </p>
            </div>
          </div>
        </header>

        {/* HERO FEATURED MAIN MEDIA CONTENT STAGE AREA ELEMENT */}
        <div className="relative aspect-video w-full overflow-hidden border border-border bg-muted shadow-sm rounded-lg">
          <Image
            src={blog.featuredImage}
            alt={`${blog.title} presentation dashboard frame`}
            fill
            unoptimized
            className="w-full h-full object-cover "
            priority={true}
          />
        </div>

        {/* CORE SPATIAL COLUMNS SYSTEM LAYOUT BOUNDARY MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-14 items-start">
          {/* Main prose rendering content panel node */}
          <section
            className="lg:col-span-2 w-full"
            aria-label="Main article prose text layout stream"
          >
            <TiptapRenderer content={blog.body} />
          </section>

          {/* Secondary structural metadata content navigation anchor container layout stack */}
          <aside
            className="w-full"
            aria-label="Navigational supplementary content widgets panel"
          >
            <ArticleSidebar toc={blog.toc} relatedPosts={blog.relatedPosts} />
          </aside>
        </div>
      </article>
    </main>
  );
}
