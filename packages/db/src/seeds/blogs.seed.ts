import mongoose from "mongoose";
import { Blog } from "../index";

const blogs = [
  {
    title:
      "Mastering React Server Components with Next.js 14: A Complete Guide",
    slug: "mastering-react-server-components-nextjs-14",
    description:
      "A deep dive into React Server Components, Server Actions, and the new Next.js 14 App Router architecture. Learn when to use server vs client components, how to optimize data fetching, and build high-performance applications.",
    category: "react",
    featuredImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    publicAccess: true,
    publishedAt: "June 15, 2024",
    author: {
      name: "Sujan",
      role: "Mid-Level MERN Full-Stack Developer",
      avatar: "/aboutImages/profileImage2.jpg",
    },
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "React Server Components represent a paradigm shift in how we build React applications. They allow us to render components on the server, reducing client-side JavaScript and improving initial page load performance. In this comprehensive guide, we'll explore everything you need to know about RSC with Next.js 14.",
            },
          ],
        },
        {
          type: "image",
          attrs: {
            src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
            alt: "React Server Components architecture diagram showing server and client components",
          },
        },
        {
          type: "heading",
          attrs: {
            level: 2,
            id: "understanding-rsc",
          },
          content: [
            {
              type: "text",
              text: "Understanding React Server Components",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "React Server Components are different from traditional React components in several key ways:",
            },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "They run exclusively on the server and never on the client",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "They can use async/await to fetch data directly",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "They cannot use React hooks or browser APIs",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "They reduce the amount of JavaScript sent to the browser",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: {
            language: "typescript",
          },
          content: [
            {
              type: "text",
              text: `// Server Component (app/page.tsx)
import { prisma } from '@/lib/prisma'

async function getPosts() {
  return await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  })
}

export default async function HomePage() {
  const posts = await getPosts()
  
  return (
    <div className="grid gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// Client Component (PostCard.tsx)
'use client'

import { useState } from 'react'

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false)
  
  return (
    <div className="p-4 border rounded-lg">
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <button 
        onClick={() => setLiked(!liked)}
        className="text-blue-500"
      >
        {liked ? '❤️' : '🤍'} {post.likes}
      </button>
    </div>
  )
}`,
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
            id: "server-actions",
          },
          content: [
            {
              type: "text",
              text: "Server Actions: The New Way to Handle Mutations",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Server Actions are a new feature in Next.js 14 that allow you to define server-side logic that can be called directly from client components. They work seamlessly with forms and progressive enhancement.",
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: {
            language: "typescript",
          },
          content: [
            {
              type: "text",
              text: `// app/actions/posts.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
  
  if (!title || !content) {
    return { error: 'Title and content are required' }
  }
  
  await prisma.post.create({
    data: {
      title: title.toString(),
      content: content.toString(),
    }
  })
  
  revalidatePath('/posts')
  return { success: true }
}

// Client Component using Server Action
'use client'

import { useFormState } from 'react-dom'
import { createPost } from '@/app/actions/posts'

export function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, null)
  
  return (
    <form action={formAction} className="space-y-4">
      <input 
        name="title" 
        placeholder="Post title"
        className="w-full p-2 border rounded"
        required
      />
      <textarea 
        name="content" 
        placeholder="Write your post..."
        className="w-full p-2 border rounded"
        rows={5}
        required
      />
      <button 
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Post
      </button>
      {state?.error && (
        <p className="text-red-500">{state.error}</p>
      )}
    </form>
  )
}`,
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
            id: "data-fetching-patterns",
          },
          content: [
            {
              type: "text",
              text: "Advanced Data Fetching Patterns with RSC",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "One of the most powerful features of React Server Components is the ability to compose data fetching patterns. Here are some advanced techniques:",
            },
          ],
        },
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Parallel Data Fetching: Use Promise.all or separate async components to fetch data in parallel",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Sequential Data Fetching: When data depends on other data, use await in sequence",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Streaming with Suspense: Use Suspense boundaries to stream content progressively",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: {
            language: "typescript",
          },
          content: [
            {
              type: "text",
              text: `// app/dashboard/page.tsx
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Parallel data fetching
async function getStats() {
  const [users, orders, revenue] = await Promise.all([
    getUsersCount(),
    getOrdersCount(),
    getRevenue()
  ])
  return { users, orders, revenue }
}

// Sequential data fetching
async function getDetailedAnalytics() {
  const stats = await getStats()
  const trends = await getTrends(stats)
  return trends
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<LoadingSpinner />}>
        <StatsWrapper />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <AnalyticsWrapper />
      </Suspense>
    </div>
  )
}

// Streaming with Suspense
async function StatsWrapper() {
  const stats = await getStats()
  return <StatsCards stats={stats} />
}

async function AnalyticsWrapper() {
  const trends = await getDetailedAnalytics()
  return <AnalyticsCharts data={trends} />
}`,
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
            id: "caching-strategies",
          },
          content: [
            {
              type: "text",
              text: "Caching Strategies with Next.js 14",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Next.js 14 introduces several caching mechanisms that work together to provide optimal performance:",
            },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Static Generation: ",
                    },
                    {
                      type: "text",
                      text: "Pages that don't change often can be built at deploy time",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Dynamic Caching: ",
                    },
                    {
                      type: "text",
                      text: "Use the fetch API with cache options for fine-grained control",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Incremental Static Regeneration: ",
                    },
                    {
                      type: "text",
                      text: "Update static content without rebuilding the entire site",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: {
            language: "typescript",
          },
          content: [
            {
              type: "text",
              text: `// app/blog/[slug]/page.tsx

// ISR with revalidation
export const revalidate = 3600 // Revalidate every hour

// Or use fetch cache control
export default async function BlogPost({ params }) {
  const post = await fetch(
    \`https://api.example.com/posts/\${params.slug}\`,
    {
      next: {
        revalidate: 3600, // ISR
        tags: ['posts'] // Cache tags for revalidation
      }
    }
  ).then(res => res.json())
  
  return <BlogContent post={post} />
}

// Cache revalidation in Server Actions
'use server'

import { revalidateTag } from 'next/cache'

export async function updatePost(postId: string, data: FormData) {
  // Update post in database
  await updatePostInDB(postId, data)
  
  // Revalidate all posts cache
  revalidateTag('posts')
  revalidatePath(\`/blog/\${postId}\`)
}`,
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
            id: "best-practices",
          },
          content: [
            {
              type: "text",
              text: "Best Practices and Performance Tips",
            },
          ],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Use Server Components by default, and only add 'use client' when you need interactivity. This ensures minimal JavaScript is sent to the client.",
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Here are some key best practices to follow:",
            },
          ],
        },
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Default to Server Components",
                    },
                    {
                      type: "text",
                      text: ": Start with server components and move to client components only when needed",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Use the 'use client' boundary strategically",
                    },
                    {
                      type: "text",
                      text: ": Place it as far down the tree as possible to limit client JavaScript",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Leverage Server Actions for form submissions",
                    },
                    {
                      type: "text",
                      text: ": They provide better security and performance than traditional API routes",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      marks: [{ type: "bold" }],
                      text: "Implement proper error boundaries",
                    },
                    {
                      type: "text",
                      text: ": Use Suspense and ErrorBoundary components for graceful error handling",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "image",
          attrs: {
            src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
            alt: "React Server Components architecture diagram showing the flow between server and client",
          },
        },
        {
          type: "heading",
          attrs: {
            level: 2,
            id: "conclusion",
          },
          content: [
            {
              type: "text",
              text: "Conclusion",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "React Server Components with Next.js 14 represent the future of React development. By understanding when to use server vs client components, how to leverage Server Actions, and implementing proper caching strategies, you can build applications that are both performant and maintainable.",
            },
          ],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The key to mastering RSC is understanding that it's not about replacing client-side React, but about complementing it with server-side rendering where it makes sense.",
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "As you continue to explore React Server Components, remember to start small, experiment with different patterns, and gradually adopt these new features into your projects. The ecosystem is still evolving, and there's never been a more exciting time to be a React developer!",
            },
          ],
        },
      ],
    },
  },
  {
    title: "Advanced State Management Patterns in React 18",
    slug: "advanced-state-management-patterns-react-18",
    description:
      "Deep dive into useSyncExternalStore, transitions, and clean server-state boundaries for scalable React applications.",
    category: "react",
    featuredImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80",
    publicAccess: true,
    publishedAt: "May 12, 2024",
    author: {
      name: "Sujan",
      role: "Mid-Level MERN Full-Stack Developer",
      avatar: "/aboutImages/profileImage2.jpg",
    },
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "React applications become difficult to maintain when every kind of state is treated the same way. Local UI state, shared client state, and server state each need different tools.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Understanding State Boundaries",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Local component state should stay close to the component. Server state should usually be handled by TanStack Query, while global UI state can live in a small Zustand store when many unrelated components need access.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "When To Use Transitions",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Transitions help keep the interface responsive while React prepares non-urgent updates. They are useful when filtering, searching, or navigating heavy UI sections.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "Building Resilient Microservices with Express",
    slug: "building-resilient-microservices-express",
    description:
      "Explore service layers, validation boundaries, centralized errors, and backend structure for reliable Express applications.",
    category: "node.js",
    featuredImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    publicAccess: true,
    publishedAt: "April 28, 2024",
    author: {
      name: "Sujan",
      role: "Mid-Level MERN Full-Stack Developer",
      avatar: "/aboutImages/profileImage2.jpg",
    },
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "A resilient Express backend is not just a list of routes. The structure around validation, services, models, and error handling decides how maintainable the app becomes.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Router Service Model Flow",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Routers should receive and validate input, services should contain business logic, and models should handle persistence. This keeps each layer focused.",
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: {
            language: "ts",
          },
          content: [
            {
              type: "text",
              text: "export async function getPublicProjects(input) {\n  return Project.find({ publicAccess: true }).lean();\n}",
            },
          ],
        },
      ],
    },
  },
  {
    title: "The Architecture of a Real-Time Dashboard",
    slug: "architecture-real-time-dashboard",
    description:
      "How event flow, caching, and subscription design shape scalable real-time dashboard systems.",
    category: "system-design",
    featuredImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    publicAccess: true,
    publishedAt: "April 15, 2024",
    author: {
      name: "Sujan",
      role: "Mid-Level MERN Full-Stack Developer",
      avatar: "/aboutImages/profileImage2.jpg",
    },
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Real-time dashboards need more than fast charts. They need predictable event flow, clean cache boundaries, and careful subscription management.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Designing Event Flow",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Every event should have a clear source, transformation path, and destination. Without that structure, real-time systems become difficult to debug.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "Dockerizing Your MERN Stack Development",
    slug: "dockerizing-mern-stack-development",
    description:
      "A practical guide to Docker-based development environments for MongoDB, Express, React, and Node.js apps.",
    category: "devops",
    featuredImage:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80",
    publicAccess: true,
    publishedAt: "March 30, 2024",
    author: {
      name: "Sujan",
      role: "Mid-Level MERN Full-Stack Developer",
      avatar: "/aboutImages/profileImage2.jpg",
    },
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Docker helps make local development consistent across machines. For MERN apps, it can simplify MongoDB setup, environment isolation, and deployment preparation.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Why Containers Help",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Containers reduce environment drift. The same services, ports, and dependencies can be used across local development and CI.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "MongoDB Aggregation Framework Explained",
    slug: "mongodb-aggregation-framework-explained",
    description:
      "Learn how MongoDB aggregation pipelines transform, group, and reshape application data efficiently.",
    category: "node.js",
    featuredImage:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    publicAccess: true,
    publishedAt: "March 12, 2024",
    author: {
      name: "Sujan",
      role: "Mid-Level MERN Full-Stack Developer",
      avatar: "/aboutImages/profileImage2.jpg",
    },
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "MongoDB aggregation lets the database perform complex transformations before data reaches your application. This can reduce backend logic and improve performance.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Pipeline Thinking",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "A pipeline is a sequence of stages. Each stage receives documents, transforms them, and passes them to the next stage.",
            },
          ],
        },
      ],
    },
  },
  {
    title: "Building Scalable MERN Architectures: From Prototype to Production",
    slug: "building-scalable-mern-architectures",
    description:
      "The MERN stack is fast for prototypes, but production-ready systems need stronger architectural boundaries.",
    category: "Architecture",
    featuredImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    publicAccess: true,
    publishedAt: "May 24, 2024",
    author: {
      name: "Sujan",
      role: "Mid-Level MERN Full-Stack Developer",
      avatar: "/aboutImages/profileImage2.jpg",
    },
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The MERN stack has become the gold standard for rapid application development. However, bridging the gap between a working prototype and a scalable production system requires architectural discipline.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "The Anatomy of a Production-Ready Backend",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "In a production environment, your Express server should not just be a collection of routes. Controllers, services, schemas, and models should each have clear responsibilities.",
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: {
            language: "javascript",
          },
          content: [
            {
              type: "text",
              text: "const UserService = {\n  async createUser(userData) {\n    validateInput(userData);\n    return await UserRepository.save(userData);\n  }\n};",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Frontend State Management Beyond useState",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "As your React application grows, prop drilling becomes painful. Zustand can manage client UI state, while TanStack Query should own server state.",
            },
          ],
        },
        {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Scalability is not just about handling more users; it is about maintaining developer velocity and system reliability as complexity grows.",
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "Optimization Strategies for MongoDB",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Indexing strategy is critical. Without proper indexes, your read queries will eventually slow down as the collection grows.",
            },
          ],
        },
      ],
    },
  },
];

await Blog.deleteMany({});
await Blog.insertMany(blogs);

console.log("Blogs Seeded Successfully");

await mongoose.disconnect();
