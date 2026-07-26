import mongoose from "mongoose";
import type { Model, InferSchemaType } from "mongoose";

const { model, models, Schema } = mongoose;

const timelineSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    period: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    bullets: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["education", "experience"],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    publicAccess: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "timeline",
    timestamps: true,
  },
);

type TimelineDocument = InferSchemaType<typeof timelineSchema>;

export const Timeline =
  (models.Timeline as Model<TimelineDocument> | undefined) ||
  model<TimelineDocument>("Timeline", timelineSchema);
