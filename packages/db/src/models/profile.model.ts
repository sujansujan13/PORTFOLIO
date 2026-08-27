import { Schema, model, models } from "mongoose";
import type { InferSchemaType, Model } from "mongoose";

// Sub-schema for individual technical skills
const skillSchema = new Schema({
  name: { type: String, required: true }, // e.g., "React & Next.js"
  category: {
    type: String,
    enum: ["Frontend", "Backend", "Cloud", "Database", "Tools"],
    default: "Frontend",
  }, // e.g., "Frontend"
  subtitle: { type: String, default: "" }, // e.g., "Dynamic UI & SSR"
  proficiency: { type: Number, min: 0, max: 100, default: 80 }, // e.g., 90%
  isCore: { type: Boolean, default: false }, // Core Ecosystem star flag
  isVisible: { type: Boolean, default: true },
});

// Sub-schema for learning roadmap goals
const learningGoalSchema = new Schema({
  name: { type: String, required: true }, // e.g., "Rust"
  status: {
    type: String,
    enum: ["Exploring", "Learning", "Deep Dive"],
    default: "Learning",
  },
  description: { type: String, default: "" },
  progress: { type: Number, min: 0, max: 100, default: 0 },
});

// Main Unified Profile Schema
const profileSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },

    // Hero & Basic Profile Fields
    fullName: { type: String, required: true },
    typeWriterTitles: {
      type: [String],
      default: ["Full-Stack Developer", "UI/UX Architect", "Problem Solver"],
    },
    primaryRole: { type: String, default: "Full-Stack Engineer" },
    location: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    twitterUrl: { type: String, default: "" },

    // Bio Text
    shortBio: { type: String, default: "" }, // Shown on Home Hero page
    fullBio: { type: String, default: "" }, // Detailed bio for /about page

    // Embedded Sub-arrays
    skills: [skillSchema],
    learningGoals: [learningGoalSchema],
  },
  { timestamps: true, collection: "profiles" },
);

export type ProfileDocument = InferSchemaType<typeof profileSchema>;

export const Profile =
  (models.Profile as Model<ProfileDocument> | undefined) ||
  model<ProfileDocument>("Profile", profileSchema);

