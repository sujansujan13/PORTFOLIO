import mongoose from "mongoose";
import type { InferSchemaType, Model } from "mongoose";

const { Schema, model, models } = mongoose;

// const bodySegmentSchema = new Schema({
//   type: { type: String, required: true },
//   text: String,
//   code: String,
//   language: String,
//   url: String,
//   caption: String,
//   id: String,
// });

const blogSchema = new Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: { type: String, required: true },
    category: { type: String, required: true },
    featuredImage: { type: String, required: true },
    publicAccess: { type: Boolean, default: true },
    publishedAt: { type: Date, required: true },
    author: {
      name: { type: String, required: true },
      role: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    // #WHAT# ->
    body: { type: Schema.Types.Mixed, required: true },
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
    collection: "blogs",
    timestamps: true,
  },
);

blogSchema.index({ userId: 1, slug: 1 }, { unique: true });

type BlogDocument = InferSchemaType<typeof blogSchema>;

export const Blog =
  (models.Blog as Model<BlogDocument> | undefined) ||
  model<BlogDocument>("Blog", blogSchema);
