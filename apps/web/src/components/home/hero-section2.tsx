"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Download } from "lucide-react";
import Link from "next/link";

// 1. Tech stack ecosystem badges data mapping
const ECOSYSTEM_BADGES = [
  { name: "MongoDB", icon: "🍃" },
  { name: "Express", icon: "🚂" },
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "Next.js", icon: "▲" },
];

export default function HeroSection() {
  // Roles for the typewriter animation loop
  const roles = [
    "MERN Stack Developer",
    "Next.js Developer",
    "Full-Stack Engineer",
  ];
  const [index, setIndex] = React.useState(0);

  // Cycle through the roles array every 3 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Framer Motion layout configuration variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    } as const,
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 text-center bg-background text-foreground overflow-hidden">
      {/* Visual background ambient glow spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto flex flex-col items-center z-10 space-y-6 sm:space-y-8"
      >
        {/* Location Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm text-xs sm:text-sm shadow-sm"
        >
          <MapPin className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="font-medium text-foreground/90">
            Kathmandu, Nepal
          </span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        </motion.div>

        {/* Hero Copy */}
        <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-foreground/80 tracking-tight">
            Hi, I'm{" "}
            <span className="text-foreground font-semibold">Sudeep</span>
          </h2>

          {/* Smooth Text Typewriter Swapping using AnimatePresence */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight min-h-14 sm:min-h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-linear-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent"
              >
                {roles[index]}
              </motion.span>
            </AnimatePresence>
            {/* Blinking visual caret effect */}
            <motion.span
              animate={{ opacity: [1, 1, 0, 0] }} // Hard steps achieved via keyframes
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="inline-block ml-1 w-1 h-8 sm:h-12 md:h-14 bg-primary align-middle"
            />
          </h1>
        </motion.div>

        {/* Supporting Paragraph Description */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg max-w-2xl text-muted-foreground leading-relaxed px-2 sm:px-0"
        >
          Crafting high-performance web applications with the MERN stack and
          Next.js. I specialize in building scalable architectures and
          delightful user experiences that bridge the gap between design and
          technical excellence.
        </motion.p>

        {/* Interactive Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-center gap-4 pt-2"
        >
          <Link
            href="#projects"
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-98"
          >
            View My Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href={"/cv.pdf" as any}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-transparent border border-orange-500/40 dark:border-orange-500/30 text-foreground font-medium rounded-md transition-all duration-300 hover:bg-orange-500/5 hover:border-orange-500 active:scale-98"
          >
            <Download className="h-4 w-4 text-orange-500" />
            Download CV
          </Link>
        </motion.div>

        {/* Core Ecosystem Badges Container */}
        <motion.div
          variants={itemVariants}
          className="w-full pt-12 sm:pt-16 space-y-4"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
            Core Ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 px-4">
            {ECOSYSTEM_BADGES.map((badge) => (
              <div
                key={badge.name}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border border-border bg-card/40 backdrop-blur-xs text-xs sm:text-sm font-medium transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-sm"
              >
                <span>{badge.icon}</span>
                <span className="text-foreground/90">{badge.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
