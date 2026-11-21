import { Profile, User } from "@my-portfolio/db";
import mongoose from "mongoose";
import { TRPCError } from "@trpc/server";
import {
  profileInputSchema,
  type ProfileInput,
} from "../schemas/profile/profile-input.schema";

/**
 * 1. Upsert Profile (Create if not exists, Update if already exists)
 */
export async function upsertProfile(userId: string, input: ProfileInput) {
  try {
    // Drop legacy/problematic unique index on skills.category in MongoDB if present
    try {
      const indexes = await Profile.collection.getIndexes();
      for (const indexName of Object.keys(indexes)) {
        if (indexName.includes("skills.category")) {
          await Profile.collection.dropIndex(indexName);
        }
      }
    } catch {
      // Ignore if index doesn't exist or collection hasn't been created yet
    }

    const validatedInput = profileInputSchema.parse(input);

    const profile = await Profile.findOneAndUpdate(
      { userId },
      {
        $set: {
          userId,
          ...validatedInput,
          typeWriterTitles: validatedInput.typewriterTitles,
        },
      },
      { upsert: true, new: true, runValidators: true },
    ).lean();

    return profile;
  } catch (error: any) {
    console.error("Error saving profile:", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    if (error?.name === "ZodError") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Validation Error: ${error.errors?.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ") || error.message}`,
      });
    }

    if (error?.name === "ValidationError") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Database Validation Error: ${error.message}`,
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        error?.message || "Internal Server Error Occurred While Saving Profile",
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

export async function getContactMeta(input?: {
  userId?: string;
  email?: string;
}) {
  try {
    const userId = input?.userId;
    const sessionEmail = input?.email;

    let profile = null;

    if (userId) {
      profile = await Profile.findOne({ userId })
        .select(
          "location githubUrl linkedinUrl email twitterUrl fullName userId -_id",
        )
        .lean();
    } else {
      profile = await Profile.findOne({})
        .select(
          "location githubUrl linkedinUrl email twitterUrl fullName userId -_id",
        )
        .sort({ updatedAt: -1 })
        .lean();
    }

    let resolvedEmail = profile?.email || "";
    const targetUserId = userId || profile?.userId;

    if (!resolvedEmail) {
      if (targetUserId) {
        const queryConditions: any[] = [
          { _id: targetUserId },
          { id: targetUserId },
        ];

        if (mongoose.Types.ObjectId.isValid(targetUserId)) {
          queryConditions.push({
            _id: new mongoose.Types.ObjectId(targetUserId),
          });
        }

        const ownerUser = await User.findOne({ $or: queryConditions })
          .select("email")
          .lean();

        if (ownerUser?.email) {
          resolvedEmail = ownerUser.email;
        }
      }

      // If user lookup by ID didn't find an email, use session email if provided
      if (!resolvedEmail && sessionEmail) {
        resolvedEmail = sessionEmail;
      }
    }

    return {
      location: profile?.location || "",
      githubUrl: profile?.githubUrl || "",
      linkedinUrl: profile?.linkedinUrl || "",
      twitterUrl: profile?.twitterUrl || "",
      fullName: profile?.fullName || "",
      email: resolvedEmail || "",
    };
  } catch (error) {
    console.error("Error fetching contact metadata", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error while fetching metadata",
    });
  }
}
