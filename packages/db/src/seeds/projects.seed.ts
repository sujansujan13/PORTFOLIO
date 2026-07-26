import mongoose from "mongoose";
import { Project } from "../index";

const projects = [
  {
    title: "Himalayan Ripple",
    subtitle: "Full-Stack Water Management Framework",
    customSlug: "himalayan-ripple",
    description:
      "An environmental tracking ecosystem designed for localized water flow analysis, data synchronization, and interactive watershed reporting.",
    body: "An environmental tracking ecosystem designed for localized water flow analysis, data synchronization, and interactive watershed reporting.",
    heroImageUrl: "/ProjectsImages/projectsImage3.png",
    thumbImageUrl: "/ProjectsImages/projectsImage3.png",
    publicAccess: true,
    techStack: ["Next.js", "Express", "tRPC", "MongoDB", "Tailwind CSS"],
    category: "fullstack",
    githuburl: "https://github.com/sujanrajpandey/himalayan-ripple",
    liveUrl: "https://himalayan-ripple.vercel.app",
    seotitle: "Himalayan Ripple",
    seodescription: "Full-stack water management and watershed reporting app.",
  },

  {
    title: "NepalExplore",
    subtitle: "Tourism Engine & Travel Discovery Hub",
    customSlug: "nepal-explore",
    description:
      "A regional exploration platform with searchable travel data, destination discovery, and rich interactive UI patterns",
    body: "A regional exploration platform with searchable travel data, destination discovery, and rich interactive UI patterns.",

    heroImageUrl: "/ProjectsImages/projectsImage1.png",
    thumbImageUrl: "/ProjectsImages/projectsImage1.png",

    publicAccess: true,
    techStack: ["React", "Framer Motion", "Zod", "Tailwind CSS"],
    category: "frontend",
    githubUrl: "https://github.com/sujanrajpandey/nepal-explore",
    liveUrl: "",
    seotitle: "NepalExplore",
    seodescription: "Tourism and travel discovery platform for Nepal.",
  },
];

await Project.deleteMany({});
await Project.insertMany(projects);

console.log("Projects Seeded SuccessFully");

await mongoose.disconnect();
