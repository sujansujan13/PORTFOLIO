import z from "zod";
import { protectedProcedure, publicProcedure, router } from "..";
import { profileInputSchema } from "../schemas/profile/profile-input.schema";

import { getProfileByUserId, getPublicProfile, upsertProfile } from "../services/profile.service";

export const profileRouter = router({
  upsertProfile: protectedProcedure
    .input(profileInputSchema)
    .mutation(({ ctx, input }) => upsertProfile(ctx.session.user.id, input)),

    getPublicProfile: publicProcedure
    .input(z.object({ userId: z.string().optional() }).optional())
    .query(({ input }) => getPublicProfile(input?.userId)),

    getProfileByUserId:protectedProcedure.query(({ctx})=> getProfileByUserId(ctx.session.user.id))

});
