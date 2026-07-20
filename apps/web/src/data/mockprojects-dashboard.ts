import type { ProjectFormValues } from "@/schemas/project";

export const initialProjects: ProjectFormValues[] = [
  {
    id: "proj-1",
    title: "Portfolio v2.0 - Sneak Peek",
    subtitle: "Personal Brand & Web Development Portfolio",
    category: "web-app",
    publicAccess: true,
    body: "",
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23592016' stroke-width='1.5'><rect width='18' height='18' x='3' y='3' rx='2'/><path d='M3 9h18M9 21V9'/></svg>",
    seoTitle: "Portfolio v2.0 - Sneak Peek",
    seoDescription: "Personal Brand & Web Development Portfolio",
    customSlug: "Portfolio v2.0 - Sneak Peek",
    techStack: ["reactjs", "nodejs"],
  },
  {
    id: "proj-2",
    title: "Quantum Portal",
    subtitle: "v4.2.1 • Internal API Service",
    body: "",
    category: "WEB APP",
    publicAccess: true,
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%231e3a8a' stroke-width='1.5'><path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'/><path d='M12 6v12M6 12h12'/></svg>",
    seoTitle: "Quantum Portal",
    seoDescription: "v4.2.1 • Internal API Service",
    customSlug: "v4.2.1 • Internal API Service",
    techStack: ["reactjs", "nodejs"],
  },
];
