import { TRPCError } from "@trpc/server";
import {
  BlogDashboardResponseSchema,
  type BlogDashboard,
  type BlogDashboardResponse,
  type BlogDetail,
  type BlogInput,
  type PublicBlogCard,
  type TiptapJson,
  type UpdateBlog,
} from "../schemas/Blogs/blog.schema";
import { Blog, User } from "@my-portfolio/db";
import type { DashboardBlogDetail } from "../schemas/Blogs/blogDashboardDetail.schema";

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

function serializeDashboardBlog(blog: any): BlogDashboard {
  return {
    id: String(blog._id),
    title: blog.title,
    featuredImage: blog.featuredImage,
    category: blog.category,
    publicAccess: blog.publicAccess,
    authorName: blog.author?.name ?? "",
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

// Purpose: Prevents duplicate slugs for website project pages.
async function assertUniqueSlug(userId:string, slug: string, ignoreId?: string) {
  const existingProject = await Blog.findOne({
    userId,
    slug,
    ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
  }).lean();

  if (existingProject) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A project with this slug already exists",
    });
  }
}

export const getPublicBlogs = async (input?: {
  category?: string;
  limit?: number;
  userId?:string
}): Promise<PublicBlogCard[]> => {
  const filter: Record<string, unknown> = {
    publicAccess: true,
  };

  if (input?.userId?.trim()) {
    filter.userId = input.userId.trim();
  } else {
    const defaultUser = await User.findOne().sort({ createdAt: 1 }).lean();
    if (defaultUser?._id) {
      filter.userId = String(defaultUser._id);
    }
  }

  if (input?.category && input.category !== "all") {
    filter.category = input.category;
  }

  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .limit(input?.limit ?? 10);
  return blogs.map(serializeBlogsCard);
};

async function getRelatedPosts(blog: { _id: unknown; category: string, userId?:string }) {
  const sameCategoryPosts = await Blog.find({
    _id: { $ne: blog._id },
    publicAccess: true,
    category: blog.category,
    // why ... => takes the properties from another object and puts them into the current object.
    ...(blog.userId?{userId:blog.userId }:{})
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
    ...(blog.userId? {userId:blog.userId} : {})
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

export async function getBlogBySlug(slug: string, userId:string): Promise<BlogDetail | null> {
  const blog = await Blog.findOne({
    slug,
    publicAccess: true,
    ...(userId? {userId}:{})
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
      userId:blog.userId
    }),
  };
}

export async function getDashboardBlogs(userId:string,input?: {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
}): Promise<BlogDashboardResponse> {
  const page = input?.page ?? 1;
  const limit = input?.limit ?? 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {userId};

  if (input?.category && input.category !== "all") {
    filter.category = input.category;
  }

  if (input?.search?.trim()) {
    const searchRegex = new RegExp(input.search.trim(), "i");

    filter.$or = [
      { title: searchRegex },
      { subtitle: searchRegex },
      { category: searchRegex },
    ];
  }

  const [blogs, totalblogs] = await Promise.all([
    Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit ?? 10)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalblogs / limit);

  return BlogDashboardResponseSchema.parse({
    blogs: blogs.map(serializeDashboardBlog),
    pagination: {
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
}

export async function createBlog(userId:string, input: BlogInput) {
  await assertUniqueSlug(userId, input.slug);
  const blog = await Blog.create({...input, userId});

  return blog;
}

function serializeDashboardBlogDetail(blog: any): DashboardBlogDetail {
  return {
    id: String(blog._id),
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    body: blog.body,
    featuredImage: blog.featuredImage,
    publicAccess: blog.publicAccess,
    category: blog.category,
    seoTitle: blog.seoTitle,
    seoDescription: blog.seoDescription,
    publishedAt: blog.publishedAt,
    author: {
      name: blog.author.name,
      role: blog.author.role,
      avatar: blog.author.avatar,
    },
  };
}

export async function getDashboardBlogById(id: string, userId:string) {
  const blog = await Blog.findOne({_id:id, userId}).lean();

  if (!blog) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Blog Not Found",
    });
  }

  return serializeDashboardBlogDetail(blog);
}

export async function updateBlog(userId:string, id: string, input: UpdateBlog) {
  const blog = await Blog.findOneAndUpdate({_id:id, userId}, input, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Blog Not Found",
    });
  }

  return {
    success: true,
  };
}

export async function deleteBlog(userId:string, id: string) {
  const blog = await Blog.findOneAndDelete({_id:id, userId});

  if (!blog) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Blog Not Found",
    });
  }

  return {
    id: String(blog._id),
    deleted: true,
  };
}

export async function deleteMultipleBlogs(userId:string, ids: string[]) {
  const result = await Blog.deleteMany({
    _id: { $in: ids },
    userId
  });

  return {
    deletedCount: result.deletedCount,
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
