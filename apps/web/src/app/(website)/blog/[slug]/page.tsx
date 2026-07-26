import React from "react";
// import type { Metadata } from "next";

import { calculateReadingTime } from "@/utils/calculateReadingTime";
import BlogDynamicClient from "@/components/blog/blog-dynamic/blog-dynamic-client";

interface PageParams {
  params: Promise<{ slug: string }>;
}

// SEO Search Engine Metadata Config Generation Injection Hook
// export async function generateMetadata({
//   params,
// }: PageParams): Promise<Metadata> {
//   const { slug } = await params;
//   if (slug !== articleMockData.slug) return {};

//   return {
//     title: `${articleMockData.title} | DevPortfolio`,
//     description: articleMockData.body[0].text?.substring(0, 160),
//     openGraph: {
//       title: articleMockData.title,
//       description: articleMockData.body[0].text?.substring(0, 160),
//       type: "article",
//       publishedTime: articleMockData.publishedAt,
//       images: [{ url: articleMockData.featuredImage }],
//     },
//   };
// }

export default async function DynamicPostPage({ params }: PageParams) {
  const { slug } = await params;

  return <BlogDynamicClient slug={slug} />;
}
