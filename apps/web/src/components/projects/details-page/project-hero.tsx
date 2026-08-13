"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import type { Route } from "next";

interface ProjectHeroProps {
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  heroImageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export function ProjectHero({
  title,
  subtitle,
  description,
  techStack,
  heroImageUrl,
  githubUrl,
  liveUrl,
}: ProjectHeroProps) {
  console.log(heroImageUrl);
  return (
    <section className="relative pt-8 pb-12">
      {/* 2-Column Grid for Large Screens, Stacked for Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Metadata & CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 space-y-6"
        >
          <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            FEATURED CASE STUDY • {subtitle}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
            {description}
          </p>

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-medium bg-secondary/80 text-secondary-foreground rounded-full border border-border"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            {liveUrl && (
              <Link
                href={liveUrl as Route}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity rounded-md shadow-sm"
              >
                Live Demo <ExternalLink className="w-4 h-4" />
              </Link>
            )}

            {githubUrl && (
              <Link
                href={githubUrl as Route}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-foreground bg-secondary/60 hover:bg-secondary border border-border transition-colors rounded-md"
              >
                View Code <Code2 className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>

        {/* Right Column: Hero Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-6"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl lg:-rotate-2 lg:hover:rotate-0 duration-500 ease-out transition-transform">
            {heroImageUrl && (
              <Image
                src={heroImageUrl}
                alt={title}
                fill
                priority
                className="object-cover "
                unoptimized
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
