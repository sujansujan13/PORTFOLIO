import mongoose from "mongoose";
import { Project } from "../index";

const projects = [
  {
    title: "Himalayan Ripple",
    subtitle: "Full-Stack Water Management Framework",
    customSlug: "himalayan-ripple",
    featured: true,
    description:
      "An environmental tracking ecosystem designed for localized water flow analysis, data synchronization, and interactive watershed reporting.",
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Himalayan Ripple is a full-stack environmental tracking ecosystem designed for localized water flow analysis, data synchronization, and interactive watershed reporting.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "The Challenge",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Environmental and watershed data can become difficult to interpret when stored in disconnected spreadsheets or static reports. The challenge was to design a platform that could present localized water-flow information and technical summaries in a clear interface.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "The Solution",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The application was designed around a full-stack architecture using Next.js, Express, tRPC, and MongoDB. Data access was separated into services, routers, and typed frontend hooks.",
            },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Built typed API communication using tRPC between frontend and backend.",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Modeled project and environmental records with MongoDB and Mongoose.",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Created responsive UI sections for public project visibility.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    heroImageUrl: "/ProjectsImages/projectsImage3.png",
    thumbImageUrl: "/ProjectsImages/projectsImage3.png",
    // galleryImages: [
    //   "/ProjectsImages/projectsImage3.png",
    //   "/ProjectsImages/projectsImage1.png",
    // ],
    publicAccess: true,
    techStack: ["Next.js", "Express", "tRPC", "MongoDB", "Tailwind CSS"],
    category: "fullstack",
    githubUrl: "https://github.com/sujanrajpandey/himalayan-ripple",
    liveUrl: "https://himalayan-ripple.vercel.app",
    caseStudyPdfUrl: "/case-studies/himalayan-ripple.pdf",

    role: "Lead Full-Stack Developer",
    timeline: "Mar 2026 - Present",
    toolsUsed: ["VS Code + Cursor", "Figma", "MongoDB Compass", "Vercel"],

    metrics: [
      { value: "96", label: "Performance Score" },
      { value: "0.8s", label: "Initial Load" },
      { value: "A+", label: "Accessibility" },
      { value: "25+", label: "Core Modules" },
    ],

    features: [
      {
        title: "Typed Full-Stack Flow",
        description:
          "Shared API types allow frontend hooks and backend services to stay aligned across project data fetching.",
        icon: "layers",
      },
      {
        title: "Environmental Data Ready",
        description:
          "The architecture can support additional watershed records, project metadata, and public reporting modules.",
        icon: "gauge",
      },
    ],

    nextProject: {
      title: "NepalExplore",
      subtitle: "Tourism Engine & Travel Discovery Hub",
      slug: "nepal-explore",
      imageUrl: "/ProjectsImages/projectsImage1.png",
    },

    seoTitle: "Himalayan Ripple Case Study",
    seoDescription:
      "A detailed case study of Himalayan Ripple, a full-stack water management and watershed reporting application.",
  },

  {
    title: "NepalExplore",
    subtitle: "Tourism Engine & Travel Discovery Hub",
    customSlug: "nepal-explore",
    featured: false,
    description:
      "A regional exploration platform with searchable travel data, destination discovery, and rich interactive UI patterns.",
    body: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "NepalExplore is a regional tourism discovery platform focused on searchable travel data, destination exploration, and interactive interface patterns.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "The Challenge",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Tourism interfaces often become cluttered when trying to combine destination media, search controls, category filters, and descriptive travel content.",
            },
          ],
        },
        {
          type: "heading",
          attrs: {
            level: 2,
          },
          content: [
            {
              type: "text",
              text: "The Solution",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The frontend was structured around reusable UI sections, motion-driven transitions, and schema-aware form patterns.",
            },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Built reusable React components for destination and travel discovery sections.",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Used Framer Motion to create smooth but restrained interaction patterns.",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Applied Zod schemas to keep frontend form and content validation predictable.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    heroImageUrl: "/ProjectsImages/projectsImage1.png",
    thumbImageUrl: "/ProjectsImages/projectsImage1.png",
    // galleryImages: [
    //   "/ProjectsImages/projectsImage1.png",
    //   "/ProjectsImages/projectsImage2.png",
    // ],
    publicAccess: true,
    techStack: ["React", "Framer Motion", "Zod", "Tailwind CSS"],
    category: "frontend",
    githubUrl: "https://github.com/sujanrajpandey/nepal-explore",
    liveUrl: "",
    caseStudyPdfUrl: "/case-studies/nepal-explore.pdf",

    role: "Frontend Developer",
    timeline: "2025 - 2026",
    toolsUsed: ["React", "Figma", "Tailwind CSS", "Framer Motion"],

    metrics: [
      { value: "94", label: "UI Score" },
      { value: "12+", label: "Reusable Sections" },
      { value: "A", label: "Accessibility" },
      { value: "30+", label: "Destinations Modeled" },
    ],

    features: [
      {
        title: "Exploration-Focused UI",
        description:
          "Destination cards, filters, and navigation patterns are designed for fast browsing and discovery.",
        icon: "compass",
      },
      {
        title: "Reusable Component System",
        description:
          "The interface is built from reusable sections that can support future destinations and content blocks.",
        icon: "blocks",
      },
    ],

    nextProject: {
      title: "Himalayan Ripple",
      subtitle: "Full-Stack Water Management Framework",
      slug: "himalayan-ripple",
      imageUrl: "/ProjectsImages/projectsImage3.png",
    },

    seoTitle: "NepalExplore Case Study",
    seoDescription:
      "A detailed case study of NepalExplore, a tourism discovery frontend built with React, Tailwind CSS, Zod, and Framer Motion.",
  },
];

await Project.deleteMany({});
await Project.insertMany(projects);

console.log("Projects Seeded Successfully");

await mongoose.disconnect();
