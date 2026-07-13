import React from "react";
import type { Metadata } from "next";
import AboutPageClient from "@/components/about/about-page-client";
import aboutData from "@/data/about-data.json";

// Pure Hardcoded Static SEO Metadata Object (Bypasses state pipelines / databases entirely)
export const metadata: Metadata = {
  title: "About Sujan Raj Pandey | Full-Stack Architect Portfolio",
  description:
    "Discover the engineering journey, technical competencies, and core paradigms of Sujan Raj Pandey, a Full-Stack software architect specializing in Next.js, Express, and distributed database engineering.",
  openGraph: {
    title: "About Sujan Raj Pandey | Full-Stack Architect Portfolio",
    description:
      "Discover the engineering journey, technical competencies, and core paradigms of Sujan Raj Pandey, a Full-Stack software architect specializing in Next.js, Express, and distributed database engineering.",
    type: "profile",
    images: [
      {
        url: "/AboutImages/profileImage2.jpg",
        width: 800,
        height: 800,
        alt: "Sujan Raj Pandey Portfolio Profile Frame",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sujan Raj Pandey | Full-Stack Architect Portfolio",
    description:
      "Full-Stack software architect specializing in Next.js, Express, and distributed database engineering.",
  },
};

export default function AboutPage() {
  return <AboutPageClient data={aboutData} />;
}
// "use client";

// import React, { useState } from "react";
// // #SOL#-> type Variants
// import { motion, AnimatePresence, type Variants } from "framer-motion";

// import {
//   Code2,
//   Terminal,
//   Database,
//   Cloud,
//   Coffee,
//   Globe,
//   Dog,
//   Dumbbell,
// } from "lucide-react";

// // Sub-component Imports
// import { SkillCard } from "../../components/about/skills-card";
// import { LearningItem } from "../../components/about/learning-item";
// import { PersonalCard } from "../../components/about/personal-card";
// import Image from "next/image";

// // --- ANIMATION CONFIGURATIONS ---
// // #SOL#->:Variants
// const fadeInVariant: Variants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
// };

// const containerStagger = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.12 },
//   },
// };

// type CategoryType = "all" | "frontend" | "backend" | "cloud";

// export default function AboutPage() {
//   const [activeCategory, setActiveCategory] = useState<CategoryType>("all");

//   // --- DATA LAYERS ---
//   const skills = [
//     {
//       id: "react-next",
//       title: "React & Next.js",
//       subtitle: "Dynamic UI & SSR",
//       percentage: 95,
//       category: "frontend" as CategoryType,
//       icon: <Code2 className="h-5 w-5 text-blue-500" />,
//       trackColor: "bg-blue-500",
//     },
//     {
//       id: "node-express",
//       title: "Node & Express",
//       subtitle: "RESTful APIs & Workers",
//       percentage: 88,
//       category: "backend" as CategoryType,
//       icon: <Terminal className="h-5 w-5 text-amber-500" />,
//       trackColor: "bg-amber-500",
//     },
//     {
//       id: "db-mgmt",
//       title: "NoSQL / SQL",
//       subtitle: "Data Modeling & Ops",
//       percentage: 90,
//       category: "backend" as CategoryType,
//       icon: <Database className="h-5 w-5 text-slate-400" />,
//       trackColor: "bg-slate-400",
//     },
//     {
//       id: "aws-devops",
//       title: "AWS & CI/CD",
//       subtitle: "DevOps & Deployment",
//       percentage: 82,
//       category: "cloud" as CategoryType,
//       icon: <Cloud className="h-5 w-5 text-orange-500" />,
//       trackColor: "bg-orange-500",
//     },
//   ];

//   const learningItems = [
//     {
//       title: "Go (Golang) Microservices",
//       desc: "Chapter 4: Concurrency Patterns",
//       color: "bg-blue-500",
//     },
//     {
//       title: "Three.js & WebGL",
//       desc: "Creative coding for immersive experiences",
//       color: "bg-amber-500",
//     },
//     {
//       title: "System Design Interview",
//       desc: "Focusing on high-availability architectures",
//       color: "bg-rose-500",
//     },
//   ];

//   const personalCards = [
//     {
//       icon: <Coffee className="h-5 w-5 text-blue-500" />,
//       title: "Caffeine Engine",
//       desc: "I've committed 2,400+ lines of code fueled purely by cold brew.",
//     },
//     {
//       icon: <Globe className="h-5 w-5 text-amber-500" />,
//       title: "Global Citizen",
//       desc: "Lived in 4 countries, bringing a diverse perspective to UI.",
//     },
//     {
//       icon: <Dog className="h-5 w-5 text-rose-500" />,
//       title: "Bug Hunter",
//       desc: "My golden retriever 'Linter' is my best pair programmer.",
//     },
//     {
//       icon: <Dumbbell className="h-5 w-5 text-indigo-500" />,
//       title: "Mental Fitness",
//       desc: "Solve daily LeetCode hards before morning gym sessions.",
//     },
//   ];

//   const filteredSkills = skills.filter(
//     (skill) => activeCategory === "all" || skill.category === activeCategory,
//   );

//   return (
//     // #NEW# :- selection:bg-primary/20 -> is a Tailwind CSS variant that styles the text selection highlight when the user selects text with their mouse or keyboard. Without it, the part becomes invisible or with outer layer.
//     <div className="w-full min-h-screen bg-background text-foreground selection:bg-primary/20">
//       <div className="max-w-7xl mx-auto px-6 py-16 sm:px-6 lg:px-12 space-y-24">
//         {/* SECTION 1: HERO OVERVIEW & PROFILE BIOGRAPHY */}
//         <motion.section
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-100px" }}
//           variants={containerStagger}
//           className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center"
//         >
//           <motion.div
//             variants={fadeInVariant}
//             className="lg:col-span-5 flex justify-center order-1 lg:order-1"
//           >
//             <figure className="relative aspect-square w-full max-w-70 md:max-w-80 lg:max-w-100 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border ">
//               <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/20 z-10 pointer-events-none" />
//               <Image
//                 src="/AboutImages/profileImage2.jpg"
//                 alt="Sujan Raj Pandey Portfolio Presentation Image"
//                 fill
//                 sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw,33vw"
//                 className="w-full h-full object-cover transform scale-102 hover:scale-105 transition-transform duration-700 ease-out"
//               />
//             </figure>
//           </motion.div>

//           <motion.div
//             variants={fadeInVariant}
//             className="lg:col-span-7 space-y-6 order-2 lg:order-2 text-left"
//           >
//             <div className="space-y-2">
//               <span className="text-sm font-bold  uppercase  text-primary tracking-wider">
//                 Full-Stack Architect
//               </span>
//               <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
//                 Designing the digital future with code.
//               </h1>
//             </div>

//             <div className="space-y-4 text-start text-lg font-inter font-medium dark:text-[#d2e4fe]  leading-relaxed">
//               <p>
//                 My coding journey began with a simple curiosity about how pixels
//                 turned into platforms. Over the last 6 years, that curiosity
//                 evolved into a systematic obsession with building scalable,
//                 high-performance web applications.
//               </p>
//               <p>
//                 I specialize in bridging the gap between elegant UI design and
//                 robust backend architecture. Whether it's optimizing MongoDB
//                 queries or crafting fluid React animations, my goal is always
//                 the same: precision, utility, and absolute reliability.
//               </p>
//             </div>

//             <div className="flex flex-wrap items-center gap-4 pt-2">
//               <button className="px-6 py-3 text-base bg-[#3755C3] text-primary-foreground font-semibold rounded-sm tracking-wide shadow-md hover:bg-primary transition-all duration-300 cursor-pointer active:scale-98">
//                 Download CV
//               </button>
//               <button className="px-6 py-3 bg-transparent text-base border border-border font-semibold rounded-sm tracking-wide text-foreground/90 hover:bg-muted hover:text-foreground transition-all duration-300 cursor-pointer active:scale-98">
//                 View GitHub
//               </button>
//             </div>
//           </motion.div>
//         </motion.section>

//         {/* SECTION 2: TECHNICAL ARSENAL (SKILLS RATIO GRIDS) */}
//         <section className="space-y-8">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-6 border-b border-border/80">
//             <div className="space-y-2 text-left">
//               <h2 className="text-3xl font-bold tracking-tight">
//                 Technical Arsenal
//               </h2>
//               <p className="text-base font-inter font-medium dark:text-[#d2e4fe]">
//                 A curated list of technologies I leverage to build modern
//                 solutions.
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {(["all", "frontend", "backend", "cloud"] as const).map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setActiveCategory(cat)}
//                   className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-xl cursor-pointer border ${
//                     activeCategory === cat
//                       ? "bg-primary text-primary-foreground border-primary"
//                       : "bg-card/40 text-foreground border-border hover:border-muted-foreground/40 hover:text-foreground"
//                   }`}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <motion.div
//             layout
//             className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
//           >
//             <AnimatePresence mode="popLayout">
//               {filteredSkills.map((skill) => (
//                 <SkillCard key={skill.id} {...skill} />
//               ))}
//             </AnimatePresence>
//           </motion.div>
//         </section>

//         {/* SECTION 3: UPDATES & HOBBIES SIDE-BY-SIDE EXPANSION */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
//           {/* Left Column: Learning Vectors Tracker */}
//           <motion.section
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-50px" }}
//             variants={containerStagger}
//             className="lg:col-span-5 space-y-6 text-left pb-8"
//           >
//             <div className="flex items-center gap-3 border-b border-border/40 ">
//               <Code2 className="h-6 w-6 text-primary" />
//               <h2 className="text-3xl  font-bold tracking-tight">
//                 Currently Learning
//               </h2>
//             </div>

//             <div className="space-y-4">
//               {learningItems.map((item, idx) => (
//                 <LearningItem key={idx} {...item} variants={fadeInVariant} />
//               ))}
//             </div>
//           </motion.section>

//           {/* Right Column: Personal Sub-cards Grid */}
//           <motion.section
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, margin: "-50px" }}
//             variants={containerStagger}
//             className="lg:col-span-7 space-y-6 text-left"
//           >
//             <div className="flex items-center gap-3 border-b border-border/40 ">
//               <Terminal className="h-5 w-5 text-primary" />
//               <h2 className="text-3xl  font-bold tracking-tight">
//                 Beyond the Screen
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {personalCards.map((card, idx) => (
//                 <PersonalCard key={idx} {...card} variants={fadeInVariant} />
//               ))}
//             </div>
//           </motion.section>
//         </div>
//       </div>
//     </div>
//   );
// }
