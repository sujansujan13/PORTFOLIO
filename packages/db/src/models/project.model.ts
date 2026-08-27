// Why is _id made false in metricSchema
// ANS: Because metricSchema is a subdocument schema inside the project document.
import mongoose from "mongoose";
import type { InferSchemaType, Model } from "mongoose";

const { Schema, model, models } = mongoose;

const allowedFeatureIcons = ["gauge", "blocks", "compass", "layers"] as const;

const metricSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
  },
  {
    _id: false,
  },
);

const featureSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      enum: allowedFeatureIcons,
      default: "gauge",
    },
  },
  {
    _id: false,
  },
);

const projectSchema = new Schema(
  {
     userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
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
      trim: true,
    },
    description: { type: String, required: true },
    body: {
      type: Schema.Types.Mixed,
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
    featured: {
      type: Boolean,
      default: false,
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
    caseStudyPdfUrl: { type: String },
    role: { type: String, required: true },
    timeline: { type: String },
    toolsUsed: { type: [String], default: [] },
    metrics: { type: [metricSchema], default: [] },
    features: { type: [featureSchema], default: [] },
    seoTitle: {
      type: String,
      required: true,
    },
    seoDescription: {
      type: String,
      required: true,
    },
  },
  {
    collection: "projects",
    timestamps: true,
  },
);

projectSchema.index({ userId: 1, customSlug: 1 }, { unique: true });

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
