import mongoose from "mongoose";
import type { InferSchemaType, Model } from "mongoose";

const { Schema, model, models } = mongoose;

const categorySchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["blog", "project", "skill"],
      required: true,
    },
    color: {
      type: String,
      default: "blue", // e.g. "blue", "rose", "emerald", "amber"
    },
  },
  {
    collection: "categories",
    timestamps: true,
  },
);

// Ensure unique slug per user per type (e.g. user can't have two blog categories named "react")
categorySchema.index({ userId: 1, type: 1, slug: 1 }, { unique: true });

type CategoryDocument = InferSchemaType<typeof categorySchema>;

export const Category =
  (models.Category as Model<CategoryDocument> | undefined) ||
  model<CategoryDocument>("Category", categorySchema);
