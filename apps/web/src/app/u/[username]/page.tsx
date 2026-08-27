"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { ContactForm } from "@/components/contact/contact-form";
import Loader from "@/components/loader";
import { usePublicProjects } from "@/hooks/usePublicProjects";
import { usePublicBlogs } from "@/hooks/usePublicBlogs";
import { useTimeline } from "@/hooks/useTimeline";

interface UserPortfolioPageProps {
  params: Promise<{ username: string }>;
}

export default function UserPortfolioPage({ params }: UserPortfolioPageProps) {
  // Unwrap Next.js 15 params promise
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  // 1. Resolve username handle to target user object
  const {
    data: owner,
    isLoading,
    error,
  } = useQuery(
    trpc.user.getByUsername.queryOptions(
      { username },
      { enabled: Boolean(username) },
    ),
  );

  // 2. Fetch public portfolio data scoped strictly to owner._id
  const ownerId = owner?._id ?? undefined;
  const { data: projects } = usePublicProjects({ userId: ownerId });
  const { data: blogs } = usePublicBlogs({ userId: ownerId });
  const { data: timeline } = useTimeline({ userId: ownerId });

  if (isLoading) {
    return <Loader />;
  }

  if (!owner || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold mb-2">404 - Portfolio Not Found</h1>
        <p className="text-muted-foreground">
          The user portfolio handle{" "}
          <span className="font-mono text-primary">@{username}</span> does not
          exist.
        </p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Portfolio Header */}
      <header className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          {owner.name}
        </h1>
        <p className="text-mono text-xs text-primary font-bold uppercase tracking-widest">
          @{owner.username} • Developer Portfolio
        </p>
      </header>

      {/* Experience & Timeline Section */}
      {timeline && timeline.experience && timeline.experience.length > 0 && (
        <section className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold">Experience & Background</h2>
          <div className="space-y-4">
            {timeline.experience.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <h3 className="font-bold">{item.role}</h3>
                <p className="text-sm text-muted-foreground">{item.company}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      {projects && Array.isArray(projects) && projects.length > 0 && (
        <section className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id || project.customSlug}
                className="p-5 rounded-lg border border-border bg-card space-y-2"
              >
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Public Blogs Section */}
      {blogs && Array.isArray(blogs) && blogs.length > 0 && (
        <section className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold">Articles & Writings</h2>
          <div className="space-y-3">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-4 rounded-lg border border-border bg-card flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{blog.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {blog.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Direct Contact Form Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">Get In Touch</h2>
        {/* Pass owner's ID as recipientUserId */}
        <ContactForm recipientUserId={owner._id ?? ""} />
      </section>
    </main>
  );
}
