import { Project } from "@my-portfolio/db";

import {
  dashboardProjectRowSchema,
  publicProjectCardSchema,
  publicProjectDetailSchema,
  type PublicProjectCard,
  type PublicProjectDetail,
  type DashboardRow,
  type DashboardResponse,
  dashboardProjectResponseSchema,
  type projectInput,
  type ProjectUpdateInput,
} from "../schemas/project.schema";
import { TRPCError } from "@trpc/server";

type RawPublicProjectCard = Omit<PublicProjectCard, "id" | "_id"> & {
  _id: unknown;
};

type RawPublicProjectDetail = Omit<
  PublicProjectDetail,
  "id" | "_id" | "relatedProject"
> & {
  _id: unknown;
};

// Purpose: keep the public card query limited to fields the card UI actually renders.
const projectCardProjection = {
  title: 1,
  subtitle: 1,
  description: 1,
  customSlug: 1,
  category: 1,
  heroImageUrl: 1,
  thumbImageUrl: 1,
  featured: 1,
  techStack: 1,
  githubUrl: 1,
  liveUrl: 1,
};

// Purpose: shape database documents into the small payload used by project cards.
function serializeProjectCard(
  project: RawPublicProjectCard,
): PublicProjectCard {
  return publicProjectCardSchema.parse({
    id: String(project._id),
    _id: String(project._id),
    title: project.title,
    subtitle: project.subtitle,
    description: project.description,
    customSlug: project.customSlug,
    category: project.category,
    heroImageUrl: project.heroImageUrl,
    thumbImageUrl: project.thumbImageUrl,
    featured: project.featured,
    techStack: project.techStack,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
  });
}

// Purpose: shape database documents into the full payload used by the detail page.
function serializeProjectDetail(
  project: RawPublicProjectDetail,
): PublicProjectDetail {
  return publicProjectDetailSchema.parse({
    id: String(project._id),
    _id: String(project._id),
    title: project.title,
    subtitle: project.subtitle,
    description: project.description,
    body: project.body,
    customSlug: project.customSlug,
    category: project.category,
    heroImageUrl: project.heroImageUrl,
    thumbImageUrl: project.thumbImageUrl,
    featured: project.featured,
    techStack: project.techStack,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    features: project.features,
    metrics: project.metrics,
    role: project.role,
    timeline: project.timeline,
    toolsUsed: project.toolsUsed,
    caseStudyPdfUrl: project.caseStudyPdfUrl,
  });
}

function serializeDashboardProject(project: any): DashboardRow {
  return dashboardProjectRowSchema.parse({
    id: String(project?._id),
    title: project.title,
    subtitle: project.subtitle,
    customSlug: project.customSlug,
    description: project.description,
    category: project.category,
    imageUrl: project.thumbImageUrl || project.heroImageUrl || "",
    publicAccess: project.publicAccess ?? false,
    featured: project.featured ?? false,
    techStack: project.techStack ?? [],
  });
}

function serializeDashboardProjectEdit(project: any) {
  return {
    id: String(project._id),

    title: project.title,
    subtitle: project.subtitle,
    customSlug: project.customSlug,

    body: project.body,
    description: project.description,

    thumbImageUrl: project.thumbImageUrl ?? "",
    heroImageUrl: project.heroImageUrl ?? "",

    publicAccess: project.publicAccess ?? false,

    techStack: project.techStack ?? [],

    category: project.category,

    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",

    seoTitle: project.seoTitle ?? "",
    seoDescription: project.seoDescription ?? "",

    role: project.role,
    timeline: project.timeline,

    toolsUsed: project.toolsUsed ?? [],

    featured: project.featured ?? false,

    metrics: project.metrics ?? [],

    features: project.features ?? [],
  };
}

// Purpose: Prevents duplicate slugs for website project pages.
async function assertUniqueSlug(customSlug: string, ignoreId?: string) {
  const existingProject = await Project.findOne({
    customSlug,
    ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
  }).lean();

  if (existingProject) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A project with this slug already exists",
    });
  }
}

export async function getPublicProjects(input?: {
  category?: string;
  limit?: number;
  featured?: boolean;
}): Promise<PublicProjectCard[]> {
  const filter: Record<string, unknown> = {
    publicAccess: true,
  };

  if (typeof input?.featured === "boolean") {
    filter.featured = input.featured;
  }

  if (input?.category && input.category !== "all") {
    filter.category = input.category;
  }

  const projects = await Project.find(filter)
    .select(projectCardProjection)
    .sort({ createdAt: -1 })
    .limit(input?.limit ?? 10)
    .lean<RawPublicProjectCard[]>(); // important

  return projects.map(serializeProjectCard);
}

async function getRelatedProject(project: {
  _id: unknown;
  category: string;
}): Promise<{
  title: string;
  category: string;
  slug: string;
  image: string;
} | null> {
  // Try to find a project in the same category
  let related = await Project.findOne({
    _id: { $ne: project._id },
    category: project.category,
    publicAccess: true,
  }).lean();

  // If none found, get any other public project
  if (!related) {
    related = await Project.findOne({
      _id: { $ne: project._id },
      publicAccess: true,
    }).lean();
  }

  if (!related) {
    return null;
  }

  return {
    title: related.title,
    category: related.category,
    slug: related.customSlug,
    image: related.thumbImageUrl ?? related.heroImageUrl ?? "",
  };
}

export async function getProjectBySlug(
  slug: string,
): Promise<PublicProjectDetail | null> {
  const project = await Project.findOne({
    customSlug: slug,
    publicAccess: true,
  }).lean<RawPublicProjectDetail | null>();

  if (!project) return null;

  const serializedProject = serializeProjectDetail(project);

  return {
    ...serializedProject,
    relatedProject: await getRelatedProject({
      _id: project._id,
      category: project.category,
    }),
  };
}

export async function getDashboardProjects(input?: {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
}): Promise<DashboardResponse> {
  const page = input?.page ?? 1;
  const limit = input?.limit ?? 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (input?.category && input.category !== "all") {
    filter.category = input.category;
  }

  if (input?.search?.trim()) {
    const searchRegex = new RegExp(input.search.trim(), "i");

    filter.$or = [
      { title: searchRegex },
      { subtitle: searchRegex },
      { category: searchRegex },
    ];
  }

  const [projects, totalProjects] = await Promise.all([
    Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit ?? 10)
      .lean(),

    Project.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalProjects / limit);

  return dashboardProjectResponseSchema.parse({
    projects: projects.map(serializeDashboardProject),
    pagination: {
      page,
      limit,
      totalProjects,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
}

export async function createProject(input: projectInput) {
  await assertUniqueSlug(input.customSlug);

  const project = await Project.create(input);

  // Project.create(input) returns a Mongoose Document, not a plain JavaScript object which contains sevaral mongoose methods.
  return serializeDashboardProject(project.toObject());
}

// Purpose: Dashboard edit page fetch by MongoDB id.
export async function getDashboardProjectById(id: string) {
  const project = await Project.findById(id).lean();

  if (!project) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Project not found",
    });
  }

  return serializeDashboardProjectEdit(project);
}

export async function updateProject(id: string, input: ProjectUpdateInput) {
  const project = await Project.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  }).lean();

  return serializeDashboardProject(project);
}

export async function deleteProject(id: string) {
  const project = await Project.findByIdAndDelete(id);

  if (!project) return null;

  return {
    id: String(project.id),
    deleted: true,
  };
}

export async function deleteManyProjects(ids: string[]) {
  const result = await Project.deleteMany({
    // $in is a MongoDB query operator that means “match any value in this list.”
    _id: { $in: ids },
  });

  return {
    deletedCount: result.deletedCount ?? 0,
  };
}
