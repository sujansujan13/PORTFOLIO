import { z } from "zod";
import mongoose from "mongoose";
import { publicProcedure, router } from "..";
import { getPublicProjects } from "../services/projects.service";

// This Zod schema validates that a value is a string and that the string is a valid MongoDB ObjectId.
const projectIdSchema = z
  .string()
  .refine((id) => mongoose.isValidObjectId(id), {
    message: "Invalid project ID",
  });

export const projectRouter = router({
  getPublicProjects: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          limit: z.number().int().min(1).max(50).default(10),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return getPublicProjects(input);
    }),
});
