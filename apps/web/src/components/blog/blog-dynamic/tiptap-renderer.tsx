// #REVISION#
import type { TiptapJson } from "@my-portfolio/api/schemas/Blogs/blog.schema";
import Image from "next/image";
import type { ReactNode } from "react";
import type React from "react";
import { CodeBlock } from "./code-block";

function getNodeText(node: TiptapJson): string {
  if (node.text) return node.text;

  return node.content?.map(getNodeText).join("") ?? "";
}

function renderInline(node: TiptapJson, index: number): ReactNode {
  if (node.type === "text") {
    let content: React.ReactNode = node.text;

    node.marks?.forEach((mark) => {
      if (mark.type === "bold") {
        content = <strong>{content}</strong>;
      }

      if (mark.type === "italic") {
        content = <em>{content}</em>;
      }

      if (mark.type === "code") {
        content = <code>{content}</code>;
      }
    });

    return <span key={index}>{content}</span>;
  }

  return node.content?.map(renderInline) ?? null;
}

function renderNode(node: TiptapJson, index: number): ReactNode {
  const children = node.content?.map(renderInline);
  switch (node.type) {
    case "paragraph":
      return (
        <p
          key={index}
          className="text-sm sm:text-base leading-relaxed text-accent-foreground"
        >
          {children}
        </p>
      );
    case "heading":
      const level = Number(node.attrs?.level ?? 2);
      const id =
        typeof node.attrs?.id === "string" ? node.attrs?.id : undefined;
      if (level === 1) {
        return (
          <h1 key={index} id={id}>
            {children}
          </h1>
        );
      }

      if (level === 3) {
        return (
          <h3
            key={index}
            id={id}
            className="text-lg font-black pt-4 scroll-mt-20"
          >
            {children}
          </h3>
        );
      }

      return (
        <h2
          key={index}
          id={id}
          className="text-xl sm:text-2xl font-black pt-4 scroll-mt-20"
        >
          {children}
        </h2>
      );

    case "blockquote":
      return (
        <blockquote
          key={index}
          className="pl-4 border-l-2 border-amber-500 italic"
        >
          {children}
        </blockquote>
      );

    case "codeBlock":
      return (
        <CodeBlock
          key={index}
          code={getNodeText(node)}
          language={
            typeof node.attrs?.language === "string"
              ? node.attrs.language
              : undefined
          }
        />
      );
    // case "codeBlock":
    //   return (
    //     <pre
    //       key={index}
    //       className="overflow-x-auto rounded-lg border border-border bg-muted p-4"
    //     >
    //       {/* #IMP# */}
    //       <code>{node.content?.map((child) => child.text).join("")}</code>
    //     </pre>
    //   );

    case "image":
      return (
        <div
          key={index}
          className="relative aspect-square w-full overflow-hidden rounded-lg border border-border"
        >
          <Image
            src={String(node.attrs?.src ?? "")}
            alt={String(node.attrs?.alt ?? "Article image")}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized
          />
        </div>
      );
    case "bulletList":
      return (
        <ul key={index} className="list-disc pl-6">
          {node.content?.map(renderNode)}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={index} className="list-decimal pl-6">
          {node.content?.map(renderNode)}
        </ol>
      );
    case "listItem":
      return <li key={index}>{node.content?.map(renderNode)}</li>;

    default:
      return node.content?.map(renderNode) ?? null;
  }
}

export function TiptapRenderer({ content }: { content: TiptapJson }) {
  return (
    <div className="space-y-6 text-foreground/90 font-sans">
      {content.content?.map(renderNode)}
    </div>
  );
}

// TAILWIND CSS
//
// scroll-mt-20
// - Tailwind class: scroll-margin-top: 5rem;
// - Used when navigating to an element via #id.
// - Prevents the heading from being hidden behind a sticky header.
//
// list-disc
// - Tailwind class: list-style-type: disc;
// - Displays a bulleted list (•).

// HTML
//
// pre
// - HTML element for preformatted text.
// - Preserves spaces, tabs, and line breaks exactly as written.
// - Commonly used for code blocks.

// by google gemini
// ("use client");

// import React from "react";
// import { CheckCircle2 } from "lucide-react";

// export interface TiptapNode {
//   type: string;
//   attrs?: Record<string, unknown>;
//   content?: TiptapNode[];
//   text?: string;
// }

// function renderInline(node: TiptapNode, index: number): React.ReactNode {
//   if (node.type === "text") {
//     return <span key={index}>{node.text}</span>;
//   }
//   return node.content?.map((child, i) => renderInline(child, i)) ?? null;
// }

// function renderNode(node: TiptapNode, index: number | string): React.ReactNode {
//   const children = node.content?.map((child, i) => renderInline(child, i));

//   switch (node.type) {
//     case "paragraph":
//       return (
//         <p
//           key={index}
//           className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4"
//         >
//           {children}
//         </p>
//       );

//     case "heading": {
//       const level = Number(node.attrs?.level ?? 2);
//       if (level === 2) {
//         return (
//           <div key={index} className="flex items-center gap-3 pt-6 pb-2">
//             {/* Accent Indicator Bar */}
//             <span className="w-4 h-1 bg-primary rounded-full inline-block" />
//             <h2 className="text-xl sm:text-2xl font-bold text-foreground">
//               {children}
//             </h2>
//           </div>
//         );
//       }
//       return (
//         <h3 key={index} className="text-lg font-bold text-foreground pt-4 pb-1">
//           {children}
//         </h3>
//       );
//     }

//     case "bulletList":
//       return (
//         <ul key={index} className="space-y-3 my-4">
//           {node.content?.map((child, i) => (
//             <li
//               key={i}
//               className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground"
//             >
//               <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
//               <div>
//                 {child.content?.map((pNode, pIdx) =>
//                   renderNode(pNode, `${i}-${pIdx}`),
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       );

//     default:
//       return (
//         node.content?.map((child, i) => renderNode(child, `${index}-${i}`)) ??
//         null
//       );
//   }
// }

// export function TiptapBodyRenderer({ content }: { content: TiptapNode }) {
//   return (
//     <div className="space-y-2">
//       {content.content?.map((node, index) => renderNode(node, index))}
//     </div>
//   );
// }
