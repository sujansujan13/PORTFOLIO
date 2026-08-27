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
          userId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return getPublicProjects(input);
    }),
  getProjectBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(2),userId: z.string().optional() }))
    .query(async ({ input }) => {
      const project = await getProjectBySlug(input.slug, input.userId as string);
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
    .query(({ ctx,input }) => getDashboardProjects(ctx.session.user.id,input)),

  createProject: protectedProcedure
    .input(projectInputSchema)
    .mutation(({ctx, input }) => createProject(ctx.session.user.id,input)),

  updateProject: protectedProcedure
    .input(
      projectUpdateSchema.extend({
        id: deleteProjectSchema.shape.id,
      }),
    )
    .mutation(async ({ ctx,input }) => {
      const { id, ...data } = input;
      const project = await updateProject(ctx.session.user.id,id, data);

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
    .query(({ctx, input }) => {
      return getDashboardProjectById(ctx.session.user.id,input.id);
    }),

  deleteProject: protectedProcedure
    .input(deleteProjectSchema)
    .mutation(async ({ctx, input }) => {
      const result = await deleteProject(ctx.session.user.id,input.id);

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
    .mutation(({ ctx,input }) => deleteManyProjects(ctx.session.user.id,input.ids)),
});
