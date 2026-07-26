import mongoose from "mongoose";
import type { InferSchemaType, Model } from "mongoose";

const { Schema, model, models } = mongoose;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    customSlug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    description: { type: String, required: true },
    body: {
      type: String,
      required: true,
    },
    heroImageUrl: {
      type: String,
    },
    thumbImageUrl: {
      type: String,
    },
    publicAccess: {
      type: Boolean,
      default: true,
    },
    techStack: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
    },
    githubUrl: {
      type: String,
    },
    liveUrl: {
      type: String,
    },
    seotitle: {
      type: String,
      required: true,
    },
    seodescription: {
      type: String,
      required: true,
    },
  },
  {
    collection: "projects",
    timestamps: true,
  },
);

// This is TypeScript only.
// It creates a type automatically from my schema, so that I don't have to write manual types
type ProjectDocument = InferSchemaType<typeof projectSchema>;

export const Project =
  (models.Project as Model<ProjectDocument> | undefined) ||
  model<ProjectDocument>("Project", projectSchema);

// #DOUBTS#
//
//  collection: "projects", -> Store all Project documents in the MongoDB collection named projects.

// export const Project =
//   (models.Project as Model<ProjectDocument> | undefined) ||
//   model<ProjectDocument>("Project", projectSchema);
//
// models.Project checks if the model has already been created.
// If it exists, reuse it.
// Otherwise, create a new model.
//
// Equivalent code:
// if (models.Project) {
//   export const Project = models.Project;
// } else {
//   export const Project = model("Project", projectSchema);
// }
