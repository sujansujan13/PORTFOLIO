"use client";

import Image from "next/image";
import React from "react";
import { CodeBlock } from "@/components/blog/blog-dynamic/code-block";

interface BodySegment {
  type: string;
  text?: string;
  code?: string;
  language?: string;
  url?: string;
  caption?: string;
  id?: string;
}

export function ArticleContent({ body }: { body: BodySegment[] }) {
  return (
    <div className="space-y-6 text-foreground/90 font-sans">
      {body.map((segment, index) => {
        switch (segment.type) {
          case "paragraph":
            return (
              <p
                key={index}
                className="text-sm sm:text-base leading-relaxed tracking-normal text-accent-foreground"
              >
                {segment.text}
              </p>
            );

          case "heading":
            return (
              <h2
                key={index}
                id={segment.id}
                className="text-xl sm:text-2xl font-black tracking-tight text-foreground pt-4 scroll-mt-20"
              >
                {segment.text}
              </h2>
            );

          case "code":
            return <CodeBlock key={index} code={segment.code ?? ""} />;

          case "blockquote":
            return (
              <blockquote
                key={index}
                className="pl-4 border-l-2 border-amber-500 italic text-sm sm:text-base text-foreground font-medium my-4"
              >
                {segment.text}
              </blockquote>
            );

          case "figure":
            return (
              <figure key={index} className="space-y-2.5 w-full">
                <div className="relative aspect-video w-full overflow-hidden border border-border bg-muted rounded-lg">
                  <Image
                    src={segment.url as string}
                    alt={segment.caption || "Article figure layout graphic"}
                    fill
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {segment.caption && (
                  <figcaption className="text-center italic text-xs font-mono text-muted-foreground">
                    {segment.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

// HTML
// PRE tag
// The <pre> tag stands for preformatted text.
// It tells the browser: "Display this text exactly as it is written."
//
// html tooltip
// <button title="Delete item">
//   🗑️
// </button>
//
// <figCaption>
// <figcaption> is an HTML semantic tag used to provide a caption (description) for a <figure>.

// Blockquote tag
// The <blockquote> tag is used to represent a quotation from another source.
// It tells the browser and search engines: "This text is a quoted passage."

// Tailwind css
// select-text is a Tailwind CSS utility that allows the user to highlight and copy text.
