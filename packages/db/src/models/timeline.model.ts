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
    startDate: {
      type: String,
      required: true,
      trim: true,
    },
    endDate: {
      type: String,
      default: null,
      trim: true,
    },
    isPresent: {
      type: Boolean,
      default: false,
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
    // Used to detect stale updates from concurrent users.
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "timeline",
    timestamps: true,
  },
);

// Prevents duplicate ordering within the same timeline type.
timelineSchema.index({ type: 1, order: 1 }, { unique: true });

type TimelineDocument = InferSchemaType<typeof timelineSchema>;

export const Timeline =
  (models.Timeline as Model<TimelineDocument> | undefined) ||
  model<TimelineDocument>("Timeline", timelineSchema);
