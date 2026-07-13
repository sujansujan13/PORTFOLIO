import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { ArticleContent } from "@/components/blog/blog-dynamic/blog-content";
import { ArticleSidebar } from "@/components/blog/blog-dynamic/article-sidebar";
import articleMockData from "@/data/blog-article.json";
import Image from "next/image";
import { calculateReadingTime } from "@/utils/calculateReadingTime";

interface PageParams {
  params: Promise<{ slug: string }>;
}

// SEO Search Engine Metadata Config Generation Injection Hook
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== articleMockData.slug) return {};

  return {
    title: `${articleMockData.title} | DevPortfolio`,
    description: articleMockData.body[0].text?.substring(0, 160),
    openGraph: {
      title: articleMockData.title,
      description: articleMockData.body[0].text?.substring(0, 160),
      type: "article",
      publishedTime: articleMockData.publishedAt,
      images: [{ url: articleMockData.featuredImage }],
    },
  };
}

export default async function DynamicPostPage({ params }: PageParams) {
  const { slug } = await params;

  // Enforce dynamic parameter validation matching pipeline architecture structures
  if (slug !== articleMockData.slug) {
    notFound();
  }

  const readingTime = calculateReadingTime(articleMockData.body);

  return (
    <main className="w-full min-h-screen bg-background text-foreground selection:bg-primary/20 py-12 px-4 sm:px-8 md:px-12 lg:px-24 xl:px-30">
      <article className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* HEADER INFORMATION LAYOUT BAR SEGMENT */}
        <header className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 bg-amber-500 text-neutral-950 font-black uppercase tracking-wider rounded-lg">
              {articleMockData.category}
            </span>
            <div className="flex items-center gap-1.5 text-accent-foreground uppercase tracking-wide font-bold">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl  font-black tracking-tight text-foreground leading-none">
            {articleMockData.title}
          </h1>

          {/* Identity Author Node Badge Section Frame */}
          <div className="flex items-center gap-3 pt-3">
            <div className="h-15 w-15 overflow-hidden bg-muted border border-primary shrink-0 rounded-full">
              <Image
                src={articleMockData.author.avatar}
                alt={articleMockData.author.name}
                className="h-full w-full object-cover rounded-full"
                width={90}
                height={100}
              />
              <div className="absolute inset-0 bg-linear-to-tr from-black/20 via-transparent to-white/10" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-black tracking-tight text-foreground">
                {articleMockData.author.name}
              </p>
              <p className=" text-xs font-mono font-medium text-muted-foreground">
                <span className="text-primary">
                  {articleMockData.author.role}
                </span>
                <span>•{articleMockData.publishedAt}</span>
              </p>
            </div>
          </div>
        </header>

        {/* HERO FEATURED MAIN MEDIA CONTENT STAGE AREA ELEMENT */}
        <div className="relative aspect-video w-full overflow-hidden border border-border bg-muted shadow-sm rounded-lg">
          <Image
            src={articleMockData.featuredImage}
            alt={`${articleMockData.title} presentation dashboard frame`}
            fill
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
            <ArticleContent body={articleMockData.body} />
          </section>

          {/* Secondary structural metadata content navigation anchor container layout stack */}
          <aside
            className="w-full"
            aria-label="Navigational supplementary content widgets panel"
          >
            <ArticleSidebar
              toc={articleMockData.toc}
              relatedPosts={articleMockData.relatedPosts}
            />
          </aside>
        </div>
      </article>
    </main>
  );
}
