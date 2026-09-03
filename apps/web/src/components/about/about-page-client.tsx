"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Code2, Terminal } from "lucide-react";

import { SkillCard } from "@/components/about/skills-card";
import { LearningItem } from "@/components/about/learning-item";
import { PersonalCard } from "@/components/about/personal-card";
import {
  SKILL_THEME_MAP,
  type SkillId,
} from "@/components/about/Styling/skill-style";
import { HeroSection } from "@/components/about/hero-section";
import { IconRenderer } from "@/components/about/icon-renderer";
import {
  PERSONAL_CARD_THEME,
  type PersonalTheme,
} from "./Styling/personal-card-style";
import { THEMES, type ThemeType } from "@/config/color-theme";

import { usePublicProfile } from "@/hooks/useProfile";

type CategoryType = "all" | "frontend" | "backend" | "cloud";

interface AboutPageClientProps {
  data: typeof import("@/data/about-data.json");
}

const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

export default function AboutPageClient({ data }: AboutPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");

  const { data: profile } = usePublicProfile();

  const parseParagraphs = (text?: string): string[] => {
    if (!text) return [];
    return text
      .split(/\r?\n\s*\r?\n|\r?\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  };

  const bioParagraphs = profile?.fullBio
    ? parseParagraphs(profile.fullBio)
    : profile?.shortBio
    ? parseParagraphs(profile.shortBio)
    : data.hero.paragraphs;

  const heroData = {
    badge: profile?.primaryRole || data.hero.badge,
    heading: profile?.fullName
      ? `Designing the digital future with code.`
      : data.hero.heading,
    paragraphs: bioParagraphs.length > 0 ? bioParagraphs : data.hero.paragraphs,
    image: profile?.avatarUrl
      ? { src: profile.avatarUrl, alt: profile.fullName || "Profile Image" }
      : data.hero.image,
    resumeUrl: profile?.resumeUrl || "/cv.pdf",
    githubUrl: profile?.githubUrl,
  };

  const dynamicSkills = profile?.skills?.length
    ? profile.skills
        .filter((s: any) => s.isVisible !== false)
        .map((s: any) => ({
          id:
            s.id ||
            s._id?.toString() ||
            s.name.toLowerCase().replace(/\s+/g, "-"),
          title: s.name,
          subtitle: s.subtitle || s.category,
          percentage: s.proficiency ?? 80,
          category: (s.category || "frontend").toLowerCase() as CategoryType,
        }))
    : data.skills;

  const filteredSkills = dynamicSkills.filter(
    (skill: any) =>
      activeCategory === "all" || skill.category === activeCategory,
  );

  const dynamicLearningItems = profile?.learningGoals?.length
    ? profile.learningGoals.map((g: any, idx: number) => {
        const themeKeys: (keyof typeof THEMES)[] = [
          "blue",
          "amber",
          "rose",
          "green",
          "purple",
        ];
        const themeKey = themeKeys[idx % themeKeys.length];
        return {
          title: g.name,
          desc:
            g.description ||
            `Status: ${g.status || "Learning"} (${g.progress ?? 0}%)`,
          theme: THEMES[themeKey],
        };
      })
    : data.learningItems.map((item) => ({
        ...item,
        theme: THEMES[item.theme as keyof typeof THEMES],
      }));

  return (
    <main className="w-full min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="max-w-8xl mx-auto px-6 py-16 sm:px-6 lg:px-16 space-y-24">
        {/* SECTION 1: HERO BIOGRAPHY CONTAINER */}
        <HeroSection
          data={heroData}
          fadeInVariant={fadeInVariant}
          containerStagger={containerStagger}
        />

        {/* SECTION 2: TECHNICAL SKILLS ISOLATION ENGINE */}
        <section
          className="space-y-8"
          aria-label="Technical skills matrices framework"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-6 border-b border-border/80">
            <div className="space-y-2 text-left">
              <h2 className="text-3xl font-bold tracking-tight">
                Technical Arsenal
              </h2>
              <p className="text-base font-inter font-medium dark:text-[#d2e4fe]">
                A curated list of technologies I leverage to build modern
                solutions.
              </p>
            </div>

            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Skill categorization filters"
            >
              {(["all", "frontend", "backend", "cloud"] as const).map((cat) => (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-xl cursor-pointer border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card/40 text-foreground border-border hover:border-muted-foreground/40 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill: any) => {
                // Smart theme resolver: maps skill ID, name keywords, or category to appropriate icon & colors
                const uiTheme = SKILL_THEME_MAP[skill.id as SkillId] || (() => {
                  const title = (skill.title || "").toLowerCase();
                  const cat = (skill.category || "").toLowerCase();

                  if (title.includes("react") || title.includes("next") || title.includes("vue") || title.includes("ui")) {
                    return { trackColor: "bg-blue-500", iconColor: "text-blue-500", iconName: "Code2" };
                  }
                  if (title.includes("node") || title.includes("express") || title.includes("api") || title.includes("nest")) {
                    return { trackColor: "bg-amber-500", iconColor: "text-amber-500", iconName: "Terminal" };
                  }
                  if (title.includes("db") || title.includes("mongo") || title.includes("sql") || title.includes("postgres") || title.includes("redis")) {
                    return { trackColor: "bg-slate-400", iconColor: "text-slate-400", iconName: "Database" };
                  }
                  if (title.includes("aws") || title.includes("cloud") || title.includes("docker") || title.includes("devops") || title.includes("ci/cd")) {
                    return { trackColor: "bg-orange-500", iconColor: "text-orange-500", iconName: "Cloud" };
                  }

                  if (cat === "frontend") return { trackColor: "bg-blue-500", iconColor: "text-blue-500", iconName: "Code2" };
                  if (cat === "backend") return { trackColor: "bg-amber-500", iconColor: "text-amber-500", iconName: "Terminal" };
                  if (cat === "database") return { trackColor: "bg-slate-400", iconColor: "text-slate-400", iconName: "Database" };
                  if (cat === "cloud" || cat === "tools") return { trackColor: "bg-orange-500", iconColor: "text-orange-500", iconName: "Cloud" };

                  return { trackColor: "bg-primary", iconColor: "text-primary", iconName: "Code2" };
                })();

                return (
                  <SkillCard
                    key={skill.id}
                    id={skill.id}
                    title={skill.title}
                    subtitle={skill.subtitle}
                    percentage={skill.percentage}
                    category={skill.category as CategoryType}
                    trackColor={uiTheme.trackColor}
                    icon={
                      <IconRenderer
                        name={uiTheme.iconName}
                        className={`${uiTheme.iconColor} h-5 w-5`}
                      />
                    }
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* SECTION 3: PERIPHERAL DEVELOPMENT PROFILE LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Currently Learning Tracking Sub-Grid */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerStagger}
            className="lg:col-span-5 space-y-6 text-left pb-8"
          >
            <div className="flex items-center gap-3 border-b py-2 border-border/80">
              <Code2 className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">
                Currently Learning
              </h2>
            </div>

            <div className="space-y-4">
              {dynamicLearningItems.map((item: any, idx: number) => {
                return (
                  <LearningItem
                    key={idx}
                    {...item}
                    variants={fadeInVariant}
                  />
                );
              })}
            </div>
          </motion.section>

          {/* Core Personal Vectors Sub-Grid */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerStagger}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="flex items-center gap-3 border-b py-2 border-border/80">
              <Terminal className="h-5 w-5 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">
                Beyond the Screen
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.personalCards.map((card, idx) => {
                const personalTheme =
                  PERSONAL_CARD_THEME[card.type as PersonalTheme];
                return (
                  <PersonalCard
                    key={idx}
                    title={card.title}
                    desc={card.desc}
                    icon={
                      <IconRenderer
                        name={card.type}
                        className={`${personalTheme.color} h-5 w-5`}
                      />
                    }
                    variants={fadeInVariant}
                  />
                );
              })}
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

// JAVASCRIPT
//
// // Two ways to access object properties:
// 1. Dot notation (literal)
// SKILL_THEME_MAP.reactNext
// 2. Bracket notation (dynamic)
// SKILL_THEME_MAP[skill.id]  // ← This is what you're doing
