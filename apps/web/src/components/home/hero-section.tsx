"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Variants as FramerVariants } from "framer-motion";
import { MapPin, ArrowRight, Download } from "lucide-react";
import Link from "next/link";

const ECOSYSTEM_BADGES = [
  { name: "MongoDB", icon: "🍃" },
  { name: "Express", icon: "🚂" },
  { name: "React", icon: "⚛️" },
  { name: "Node.js", icon: "🟢" },
  { name: "Next.js", icon: "▲" },
];

const ROLES = [
  "Full-Stack Engineer",
  "MERN Stack Developer",
  "Next.js Developer",
];

export default function HeroSection() {
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = ROLES[roleIndex];

    const handleType = () => {
      if (!isDeleting) {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));

        if (displayText === currentFullText) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));

        if (displayText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
          return;
        }
      }

      const speed = isDeleting ? 40 : 100;
      timer = setTimeout(handleType, speed);
    };

    timer = setTimeout(handleType, isDeleting ? 40 : 100);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  const containerVariants: FramerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.15 },
    },
  };

  const itemVariants: FramerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[95vh] px-4 sm:px-6 lg:px-8 py-6 md:py-10 xl:py-20  text-center bg-background text-foreground overflow-hidden">
      {/* Visual background ambient glow spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto flex flex-col items-center z-10 space-y-6 sm:space-y-6 w-full"
      >
        {/* Location Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 px-3 py-2 rounded-full border border-border dark:bg-[#15263a] backdrop-blur-sm text-xs sm:text-sm  shadow-md"
        >
          <MapPin className="h-4 w-4 text-primary animate-pulse fill-white" />
          <span className="font-semibold dark:text-foreground/90">
            Kathmandu, Nepal
          </span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        </motion.div>

        {/* Hero Copy */}
        <motion.div
          variants={itemVariants}
          className="space-y-3 sm:space-y-4 w-full"
        >
          <h2 className="text-lg sm:text-xl md:text-3xl font-semibold text-foreground/80 tracking-tight">
            Hi, I'm <span className="text-foreground font-bold">Sujan</span>
          </h2>

          {/* Stable Static Flex Layout (Solves edge cutting on Fullscreen & Inspector windows) */}
          <div className="w-full min-h-12 sm:min-h-16  flex items-center justify-center overflow-visible  ">
            <h1 className=" text-2xl sm:text-4xl md:text-5xl  font-bold tracking-tight flex items-center justify-center text-center whitespace-nowrap max-w-full  px-4 overflow-visible">
              {/* Extra trailing padding added here explicitly to give gradient bounds breathing room */}
              <span className="bg-linear-to-r from-foreground via-foreground/90 to-primary bg-clip-text font-mono text-transparent inline-block select-none pr-1">
                {displayText}
              </span>

              {/* Blinking visual caret effect */}
              <motion.span
                animate={{ opacity: [1, 1, 0, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block ml-1 w-0.5 h-6 sm:h-10 md:h-14 bg-primary align-middle"
              />
            </h1>
          </div>
        </motion.div>

        {/* Supporting Paragraph Description */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto text-[#454653] dark:text-[#acbcd5] leading-relaxed px-2 sm:px-0 font-semibold"
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
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8.5 py-6 bg-[#1f40af] text-primary-foreground font-semibold shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-95 rounded-lg overflow-hidden text-sm "
          >
            View My Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="/cv.pdf"
            download
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8.5 py-6 bg-transparent border-2 border-[#855201] dark:border-[#855201] text-[#855201] dark:text-yellow-300  font-semibold rounded-md transition-all duration-300 hover:bg-orange-500/5 hover:border-[#241c10] active:scale-98 text-sm"
          >
            <Download className="h-4 w-4 text-[#855201" />
            Download CV
          </a>
        </motion.div>

        {/* Core Ecosystem Badges Container */}
        <motion.div
          variants={itemVariants}
          className="w-full pt-12 sm:pt-16 space-y-4"
        >
          <p className="text-base font-bold uppercase tracking-widest  dark:text-[#c4c5d5]">
            Core Ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 px-4">
            {ECOSYSTEM_BADGES.map((badge) => (
              <div
                key={badge.name}
                className="flex items-center gap-3 px-4 sm:px-4 py-2.5 rounded-lg border border-border bg-[#e8f0ff] dark:bg-card/40 backdrop-blur-xs text-sm sm:text-sm font-medium transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-sm"
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
