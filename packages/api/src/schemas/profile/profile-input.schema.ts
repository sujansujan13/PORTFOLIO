import { z } from "zod";

// 1. Skill Item Schema
export const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill name is required").max(50),
  category: z
    .enum(["Frontend", "Backend", "Cloud", "Database", "Tools"])
    .default("Frontend"),
  subtitle: z.string().max(100).optional().default(""),
  proficiency: z.number().min(0).max(100).default(80),
  isCore: z.boolean().default(false), // Featured in Core Ecosystem
  isVisible: z.boolean().default(true),
});

export type SkillItem = z.infer<typeof skillItemSchema>;

// 2. Learning Goal Schema
export const learningGoalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Goal name is required").max(50),
  status: z.enum(["Exploring", "Learning", "Deep Dive"]).default("Learning"),
  description: z.string().max(250).optional().default(""),
  progress: z.number().min(0).max(100).default(0),
});

export type LearningGoal = z.infer<typeof learningGoalSchema>;

// 3. Main Profile Form Input Schema
export const profileInputSchema = z.object({
  // Hero & Basic Info
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(60),
  primaryRole: z
    .string()
    .min(2, "Primary role is required")
    .max(100)
    .default("Full-Stack Engineer"),
  location: z.string().max(100).optional().default(""),
  avatarUrl: z
    .url("Invalid avatar image URL")
    .or(z.literal(""))
    .optional()
    .default(""),
  resumeUrl: z
    .url("Invalid resume PDF URL")
    .or(z.literal(""))
    .optional()
    .default(""),

  // Dynamic Typewriter Roles
  typewriterTitles: z
    .array(z.string().min(1).max(50))
    .max(10, "Maximum 10 typewriter titles allowed")
    .default(["Full-Stack Engineer", "UI/UX Creator", "Problem Solver"]),

  // Bios
  shortBio: z
    .string()
    .max(300, "Short bio cannot exceed 300 characters")
    .optional()
    .default(""),
  fullBio: z
    .string()
    .max(3000, "Full bio cannot exceed 3000 characters")
    .optional()
    .default(""),

  // Social Links
  githubUrl: z
    .url("Invalid GitHub URL")
    .or(z.literal(""))
    .optional()
    .default(""),
  linkedinUrl: z
    .url("Invalid LinkedIn URL")
    .or(z.literal(""))
    .optional()
    .default(""),
  twitterUrl: z
    .url("Invalid Twitter URL")
    .or(z.literal(""))
    .optional()
    .default(""),

  // Embedded Lists
  skills: z.array(skillItemSchema).default([]),
  learningGoals: z.array(learningGoalSchema).default([]),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;
