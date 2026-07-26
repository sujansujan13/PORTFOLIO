import type {
  BlogDetail,
  PublicBlogCard,
  TiptapJson,
} from "../schemas/blog.schema";
import { Blog } from "@my-portfolio/db";

function serializeBlogsCard(blog: any): PublicBlogCard {
  return {
    id: String(blog._id),
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    category: blog.category,
    publishedAt: blog.publishedAt,
    featuredImage: blog.featuredImage,
  };
}

// #WHAT# ->
function createSlugFromHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// #WHAT# ->
function getNodeText(node: TiptapJson): string {
  if (node.text) return node.text;

  return node.content?.map(getNodeText).join("") ?? "";
}

// #WHAT# ->
function addHeadingIds(node: TiptapJson): TiptapJson {
  if (node.type === "heading") {
    const text = getNodeText(node);
    const attrs = node.attrs ?? {};

    return {
      ...node,
      attrs: {
        ...attrs,
        id: attrs.id ?? createSlugFromHeading(text),
      },
      content: node.content?.map(addHeadingIds),
    };
  }

  return {
    ...node,
    content: node.content?.map(addHeadingIds),
  };
}

function buildTocFromJson(node: TiptapJson) {
  const toc: { id: string; label: string }[] = [];

  function walk(current: TiptapJson) {
    if (current.type === "heading") {
      const label = getNodeText(current);
      const id =
        typeof current.attrs?.id === "string"
          ? current.attrs.id
          : createSlugFromHeading(label);

      if (label) {
        toc.push({ id, label });
      }
    }
    current.content?.forEach(walk);
  }
  walk(node);

  return toc;
}

export const getPublicBlogs = async (input?: {
  category?: string;
  limit?: number;
}): Promise<PublicBlogCard[]> => {
  const filter: Record<string, unknown> = {
    publicAccess: true,
  };

  if (input?.category && input.category !== "all") {
    filter.category = input.category;
  }

  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .limit(input?.limit ?? 10);
  return blogs.map(serializeBlogsCard);
};

async function getRelatedPosts(blog: { _id: unknown; category: string }) {
  const sameCategoryPosts = await Blog.find({
    _id: { $ne: blog._id },
    publicAccess: true,
    category: blog.category,
  })
    .sort({ createdAt: -1 })
    .limit(2)
    .lean();

  const remainingLimit = 2 - sameCategoryPosts.length;

  if (remainingLimit === 0) {
    return sameCategoryPosts.map((post) => ({
      title: post.title,
      category: post.category,
      slug: post.slug,
      image: post.featuredImage,
    }));
  }

  const fallBackPosts = await Blog.find({
    _id: { $ne: blog._id, $nin: sameCategoryPosts.map((post) => post._id) },
    publicAccess: true,
  })
    .sort({ createdAt: -1 })
    .limit(remainingLimit)
    .lean();

  return [...sameCategoryPosts, ...fallBackPosts].map((post) => ({
    title: post.title,
    category: post.category,
    slug: post.slug,
    image: post.featuredImage,
  }));
}

export async function getBlogBySlug(slug: string): Promise<BlogDetail | null> {
  const blog = await Blog.findOne({
    slug,
    publicAccess: true,
  }).lean();

  if (!blog) return null;

  if (!blog.author) {
    throw new Error("Blog author is missing");
  }

  const body = addHeadingIds(blog.body as TiptapJson);

  return {
    id: String(blog._id),
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    featuredImage: blog.featuredImage,
    category: blog.category,
    publishedAt: blog.publishedAt,
    author: {
      name: blog.author.name,
      role: blog.author.role,
      avatar: blog.author.avatar,
    },
    body,
    toc: buildTocFromJson(body),
    relatedPosts: await getRelatedPosts({
      _id: blog._id,
      category: blog.category,
    }),
  };
}

// ### 1. `createSlugFromHeading()`

// ```ts
// function createSlugFromHeading(text: string)
// ```

// **Purpose:** Converts a heading into a URL-friendly slug.

// Example:

// ```text
// "Getting Started with Next.js!"

// ↓

// "getting-started-with-next-js"
// ```

// Steps:

// * `toLowerCase()` → lowercase
// * `trim()` → remove leading/trailing spaces
// * `replace(/[^a-z0-9]+/g, "-")` → replace spaces/special characters with `-`
// * `replace(/(^-|-$)/g, "")` → remove leading/trailing `-`

// Used as the heading's HTML `id`.

// ---

// ### 2. `getNodeText()`

// ```ts
// function getNodeText(node: TiptapJson): string
// ```

// **Purpose:** Extracts plain text from a Tiptap node recursively.

// Example:

// ```text
// Heading
//  ├── "Getting "
//  └── "Started"

// ↓

// "Getting Started"
// ```

// If the node has `text`, return it. Otherwise, recursively extract text from its children and concatenate it.

// ---

// ### 3. `addHeadingIds()`

// ```ts
// function addHeadingIds(node: TiptapJson)
// ```

// **Purpose:** Adds an `id` to every heading node.

// Before:

// ```json
// {
//   "type": "heading",
//   "content": [...]
// }
// ```

// After:

// ```json
// {
//   "type": "heading",
//   "attrs": {
//     "id": "getting-started"
//   },
//   "content": [...]
// }
// ```

// Process:

// 1. Check if the node is a heading.
// 2. Extract its text (`getNodeText()`).
// 3. Generate a slug (`createSlugFromHeading()`).
// 4. Save it in `attrs.id` (unless an `id` already exists).
// 5. Recursively process child nodes.

// ---

// ### 4. `buildTocFromJson()`

// ```ts
// function buildTocFromJson(node: TiptapJson)
// ```

// **Purpose:** Generates a Table of Contents (TOC) from all headings.

// Example document:

// ```text
// # Introduction
// ## Installation
// ## API
// ```

// Produces:

// ```ts
// [
//   { id: "introduction", label: "Introduction" },
//   { id: "installation", label: "Installation" },
//   { id: "api", label: "API" },
// ]
// ```

// Process:

// 1. Traverse every node recursively.
// 2. When a heading is found:

//    * Get its text.
//    * Get/generate its `id`.
//    * Add `{ id, label }` to the TOC.
// 3. Return the complete TOC.

// ---

// ### Overall Flow

// ```text
// Tiptap JSON
//       │
//       ▼
// getNodeText()        → Extract heading text
//       │
//       ▼
// createSlugFromHeading() → Create URL-friendly id
//       │
//       ▼
// addHeadingIds()      → Add ids to headings
//       │
//       ▼
// buildTocFromJson()   → Generate Table of Contents
// ```

// These functions let users click a TOC item like **"Installation"** and jump directly to:

// ```html
// <h2 id="installation">Installation</h2>
// ```
