"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

interface HeroSectionProps {
  data: {
    badge: string;
    heading: string;
    paragraphs: string[];
    image: { src: string; alt: string };
  };
  fadeInVariant: Variants;
  containerStagger: Variants;
}

export function HeroSection({
  data,
  fadeInVariant,
  containerStagger,
}: HeroSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerStagger}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center"
    >
      <motion.div
        variants={fadeInVariant}
        className="lg:col-span-5 flex justify-center order-1 lg:order-1"
      >
        <figure className="relative aspect-square w-full max-w-70 md:max-w-80 lg:max-w-100 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border">
          <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/20 z-10 pointer-events-none" />
          <Image
            src={data.image.src}
            alt={data.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full object-cover transform scale-102 hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
        </figure>
      </motion.div>

      <motion.div
        variants={fadeInVariant}
        className="lg:col-span-7 space-y-6 order-2 lg:order-2 text-left"
      >
        <div className="space-y-2">
          <span className="text-sm font-bold uppercase text-primary tracking-wider">
            {data.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
            {data.heading}
          </h1>
        </div>

        <div className="space-y-4 text-start text-lg font-inter font-medium dark:text-[#d2e4fe] leading-relaxed">
          {data.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button className="px-6 py-3 text-base bg-[#3755C3] text-primary-foreground font-semibold rounded-sm tracking-wide shadow-md hover:bg-primary transition-all duration-300 cursor-pointer active:scale-98">
            Download CV
          </button>
          <button className="px-6 py-3 bg-transparent text-base border border-border font-semibold rounded-sm tracking-wide text-foreground/90 hover:bg-muted hover:text-foreground transition-all duration-300 cursor-pointer active:scale-98">
            View GitHub
          </button>
        </div>
      </motion.div>
    </motion.section>
  );
}
