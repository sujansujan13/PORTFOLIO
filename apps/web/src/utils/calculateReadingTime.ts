import type { TiptapJson } from "@my-portfolio/api/schemas/blog.schema";

function getTiptapText(node: TiptapJson): string {
  if (node.text) return node.text;

  return node.content?.map(getTiptapText).join(" ") ?? "";
}

export function calculateReadingTime(content: TiptapJson) {
  const text = getTiptapText(content);

  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 100));
}
// interface bodySegment {
//   text?: string;
//   code?: string;
// }

// export const calculateReadingTime = (body: bodySegment[]) => {
//   // Combine all text and code into a single string
//   const text = body
//     .map((segment) => `${segment.text ?? ""} ${segment.code ?? ""}`)
//     .join(" ");

//   // Count the words
//   const words = text.trim().split(/\s+/).filter(Boolean).length;

//   // Assume an average reading speed of 100 words per minute
//   return Math.max(1, Math.ceil(words / 100));
// };

// always remember "" (empty string is also a falsy value)
// filter(Boolean) is a JavaScript shortcut for removing all "falsy" values from an array.

// #alternative using array reduce method#
// interface BodySegment {
//   type: string;
//   text?: string;
//   code?: string;
// }
// export function calculateReadingTime(body: BodySegment[]) {
//   const words = body.reduce((count, segment) => {
//     const text = (segment.text ?? "") + " " + (segment.code ?? "");
//     return count + text.trim().split(/\s+/).filter(Boolean).length;
//   }, 0);
//   return Math.max(1, Math.ceil(words / 200));
// }
