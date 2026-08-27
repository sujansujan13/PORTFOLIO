// packages/api/src/routers/user.router.ts
import { z } from "zod";
import { publicProcedure, router } from "../index";
import {
  checkUsernameAvailability,
  getUserByUsername,
} from "../services/user.service";

export const userRouter = router({
  // Public query for /u/[username] pages
  getByUsername: publicProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(({ input }) => getUserByUsername({ username: input.username })),

  // Real-time sign-up form handle availability check
  checkUsername: publicProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(({ input }) => checkUsernameAvailability(input.username)),
});
