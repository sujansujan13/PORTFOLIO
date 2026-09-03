import { User } from "@my-portfolio/db";
import {
  usernameInputSchema,
  type UsernameInput,
} from "../schemas/user/input-username.schema";
import { TRPCError } from "@trpc/server";

export async function getUserByUsername(username: UsernameInput) {
  const validInput = usernameInputSchema.parse(username);

  try {
    const cleanUsername = validInput.username.trim();
    const user = await User.findOne({
      username: { $regex: new RegExp(`^${cleanUsername}$`, "i") },
    }).lean();

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User Not Found",
      });
    }
    return user;
  } catch (error) {
    console.error(error);
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Service Error Occurred while fetching user",
    });
  }
}

// 2. Check if a username is available during sign-up
export async function checkUsernameAvailability(username: string) {
  const cleanUsername = username.trim();
  const existingUser = await User.findOne({
    username: { $regex: new RegExp(`^${cleanUsername}$`, "i") },
  }).lean();
  return {
    available: !existingUser,
  };
}
