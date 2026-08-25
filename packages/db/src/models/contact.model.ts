import mongoose from "mongoose";
import type { HydratedDocument, InferSchemaType, Model } from "mongoose";

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

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxLength: 50 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxLength: 254,
    },
    subject: {
      type: String,
      required: true,
      enum: ["collaboration", "internship", "general"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived", "spam"],
      default: "unread",
      index: true,
    },
    /** * Email notification sent to the portfolio owner. * * The database remains the source of truth even if * email delivery fails. */
    emailNotifications: {
      status: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending",
      },
      sentAt: {
        type: Date,
        default: null,
      },
      /** * Store a short provider error for debugging. * Do NOT store sensitive provider credentials here. */
      error: { type: String, default: null, maxlength: 1000 },

      /** * Useful if your email provider gives you a message ID. */
      providerMessageId: { type: String, default: null },
    },
    /** * Optional metadata about the visitor/request. * * Keep this minimal. Avoid storing unnecessary personal data. */
    metadata: {
      ipHash: { type: String, default: null },
      userAgent: { type: String, default: null, maxlength: 1000 },
      source: { type: String, default: "contact-form", maxlength: 100 },
    },
  },
  {
    timestamps: true,
    collection: "ContactMessages",
    versionKey: false,
  },
);

contactMessageSchema.index({
  name: "text",
  email: "text",
  subject: "text",
  message: "text",
});

export type Message = InferSchemaType<typeof contactMessageSchema>;

export type MessageDocument = HydratedDocument<Message>;

export const Contact =
  (models.Contact as Model<Message> | undefined) ||
  model<Message>("Contact", contactMessageSchema);
