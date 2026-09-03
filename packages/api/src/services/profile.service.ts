import { Profile } from "@my-portfolio/db";
import { TRPCError } from "@trpc/server";
import {
  profileInputSchema,
  type ProfileInput,
} from "../schemas/profile/profile-input.schema";


/**
 * 1. Upsert Profile (Create if not exists, Update if already exists)
 */
export async function upsertProfile(userId: string, input: ProfileInput) {
  const validatedInput = profileInputSchema.parse(input);

  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: { userId, ...validatedInput } },
      { upsert: true, new: true, runValidators: true },
    ).lean();

    return profile;
  } catch (error) {
    console.error("Error saving profile:", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error Occurred While Saving Profile",
    });
  }
}

/**
 * 2. Get Profile by User ID (Authenticated Dashboard access)
 */
export async function getProfileByUserId(userId: string) {
  try {
    const profile = await Profile.findOne({ userId }).lean();
    return profile || null;
  } catch (error) {
    console.error("Error fetching profile:", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error Occurred While Fetching Profile",
    });
  }
}

/**
 * 3. Get Public Profile (For guest visitors on / and /about pages)
 *    Falls back to primary default user if no explicit userId is provided.
 */
export async function getPublicProfile(userId?: string) {
  try {
    let profile;

    if (userId) {
      profile = await Profile.findOne({ userId }).lean();
    } else {
      // Fallback for homepage guest: Fetch the primary saved profile directly
      profile = await Profile.findOne({}).sort({ createdAt: 1 }).lean();
    }

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Public profile not found",
      });
    }

    return profile;
  } catch (error) {
    console.error("Error fetching public profile:", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error Occurred While Fetching Public Profile",
    });
  }
}

/**
 * 4. Delete Profile
 */
export async function deleteProfile(userId: string) {
  try {
    const result = await Profile.deleteOne({ userId });

    if (result.deletedCount === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Profile not found to delete",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting profile:", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error Occurred While Deleting Profile",
    });
  }
}
