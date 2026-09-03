import { z } from "zod";

export const usernameInputSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
});

export type UsernameInput = z.infer<typeof usernameInputSchema>;
