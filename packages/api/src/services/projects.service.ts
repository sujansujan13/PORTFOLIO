import { Project } from "@my-portfolio/db";

export interface PublicProject {
  id: string;
  _id: string;
  title: string;
  subtitle: string;
  body: string;
  category: string;
  customSlug: string;
  heroImageUrl?: string;
  thumbImageUrl?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

function serializeProject(
  project: PublicProject & { _id: unknown },
): PublicProject {
  return {
    id: String(project._id),
    _id: String(project._id),
    title: project.title,
    subtitle: project.subtitle,
    body: project.body,
    customSlug: project.customSlug,
    category: project.category,
    heroImageUrl: project.heroImageUrl,
    thumbImageUrl: project.thumbImageUrl,
    techStack: project.techStack,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
  };
}

export async function getPublicProjects(input?: {
  category?: string;
  limit?: number;
}): Promise<PublicProject[]> {
  const filter: Record<string, unknown> = {
    publicAccess: true,
  };

  if (input?.category && input.category !== "all") {
    filter.category = input.category;
  }

  const projects = await Project.find(filter)
    .sort({ createdAt: -1 })
    .limit(input?.limit ?? 10)
    .lean<PublicProject[]>(); // important

  return projects.map(serializeProject);
}
