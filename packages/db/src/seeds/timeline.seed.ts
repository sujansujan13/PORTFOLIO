import mongoose from "mongoose";
import { Timeline } from "../index";

const timeline = [
  {
    role: "Full-Stack Web Developer Intern",
    company: "Himalayan Ripple Project",
    location: "Kathmandu, Nepal",
    startDate: "Mar 2026",
    endDate: "Present",
    isPresent: true,
    description:
      "Architected core features for the Himalayan Ripple initiative, translating complex technical workflows into fluid client platforms.",
    bullets: [
      "Implemented high-performance web solutions using Next.js App Router and Node.js backends.",
      "Integrated robust data modeling structures and state management tools for reliable user sessions.",
      "Optimized client response layers and system queries to drop visual rendering delays.",
    ],
    tags: ["Next.js", "Express", "tRPC", "MongoDB", "Zustand", "Tailwind CSS"],
    type: "experience",
    order: 1,
    publicAccess: true,
  },
  {
    role: "Frontend Developer",
    company: "NepalExplore Platform",
    location: "Remote / Kathmandu",
    startDate: "Mar 2025",
    endDate: "Mar 2026",
    isPresent: false,
    description:
      "Engineered modular interface features, custom search blocks, and navigation elements for a dynamic regional tourism application.",
    bullets: [
      "Crafted reusable component libraries using React and utility-first Tailwind CSS styling architectures.",
      "Collaborated closely on visual lookups, emblem layouts, and accessible UI spacing models.",
      "Integrated dynamic form behaviors alongside schema-validated client responses.",
    ],
    tags: ["React", "Tailwind CSS", "Framer Motion", "Zod", "JavaScript"],
    type: "experience",
    order: 2,
    publicAccess: true,
  },
  {
    role: "Bachelor of Science in Computer Science & Information Technology",
    company: "Tribhuvan University",
    location: "Kathmandu, Nepal",
    startDate: "Mar 2022",
    endDate: "Present",
    isPresent: true,
    description:
      "Deepening understanding of advanced core technologies, database operations, and system optimizations.",
    bullets: [
      "Authored comprehensive data layout records, including an in-depth Advanced Database Lab Report.",
      "Explored spatial processing mechanisms and Geographic Information Systems mapping models.",
      "Maintained performance metrics across personal logic layouts and structural configurations.",
    ],
    tags: [
      "Advanced Database Systems",
      "GIS & Spatial Analysis",
      "Data Structures",
      "OOP",
    ],
    type: "education",
    order: 1,
    publicAccess: true,
  },
];

await Timeline.updateMany(
  {
    version: { $exists: false },
  },
  { $set: { version: 0 } },
);
await Timeline.deleteMany({});
await Timeline.insertMany(timeline);

console.log("Timeline Seeded Successfully");

await mongoose.disconnect();
