import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "..";
import {
  createProject,
  deleteManyProjects,
  deleteProject,
  getDashboardProjectById,
  getDashboardProjects,
  getProjectBySlug,
  getPublicProjects,
  updateProject,
} from "../services/projects.service";
import { TRPCError } from "@trpc/server";
import {
  deleteManyProjectsSchema,
  deleteProjectSchema,
  getDashboardProjectsSchema,
  projectIdSchema,
  projectInputSchema,
  projectUpdateSchema,
} from "../schemas/project.schema";

export const projectRouter = router({
  getPublicProjects: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          limit: z.number().int().min(1).max(50).default(10),
          featured: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return getPublicProjects(input);
    }),
  getProjectBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(2) }))
    .query(async ({ input }) => {
      const project = await getProjectBySlug(input.slug);
      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project Not Found",
        });
      }
      return project;
    }),

  getDashboardProjects: protectedProcedure
    .input(getDashboardProjectsSchema)
    .query(({ input }) => getDashboardProjects(input)),

  createProject: protectedProcedure
    .input(projectInputSchema)
    .mutation(({ input }) => createProject(input)),

  updateProject: protectedProcedure
    .input(
      projectUpdateSchema.extend({
        id: deleteProjectSchema.shape.id,
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const project = await updateProject(id, data);

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      return project;
    }),

  // Purpose: Protected dashboard edit page data.
  getDashboardProjectById: protectedProcedure
    .input(projectIdSchema)
    .query(({ input }) => {
      return getDashboardProjectById(input.id);
    }),

  deleteProject: protectedProcedure
    .input(deleteProjectSchema)
    .mutation(async ({ input }) => {
      const result = await deleteProject(input.id);

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return result;
    }),

  deleteManyProjects: protectedProcedure
    .input(deleteManyProjectsSchema)
    .mutation(({ input }) => deleteManyProjects(input.ids)),
});
