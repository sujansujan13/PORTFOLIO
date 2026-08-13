"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface NextProjectProps {
  title: string;
  slug: string;
  image: string;
}

export function NextProjectCard({
  nextProject,
}: {
  nextProject: NextProjectProps;
}) {
  return (
    <section className="pt-12 pb-8 border-t border-border/60">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">Next Project</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore other technical works
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          View Archive <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <Link href={`/projects/${nextProject.slug}`}>
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="group relative aspect-21/9 w-full overflow-hidden rounded-xl border border-border/80 bg-card shadow-lg"
        >
          <Image
            src={nextProject.image}
            alt={nextProject.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
            <h4 className="text-2xl sm:text-3xl font-black text-foreground group-hover:text-primary transition-colors">
              {nextProject.title}
            </h4>
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
