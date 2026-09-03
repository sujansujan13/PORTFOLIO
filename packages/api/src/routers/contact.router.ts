// packages/api/src/routers/contact.router.ts
import { protectedProcedure, publicProcedure, router } from "../index";
import { contactInputFormSchema } from "../schemas/contact/contact-input.schema";
import { getContactMessagesSchema } from "../schemas/contact/getContactMessage.schema";
import { toggleReadSchema } from "../schemas/contact/toggle-read.schema";
import { updateStatusSchema } from "../schemas/contact/update-status.schema";

import {
  archiveContactMessage,
  createContactMessage,
  deleteSingleContact,
  getContactMessages,
  getSingleContactMessage,
  markAllRead,
  updateContactMessageReadStatus,
  updateStatus,
} from "../services/contact.service";
import { z } from "zod";

import { User } from "@my-portfolio/db";
import { TRPCError } from "@trpc/server";

export const contactRouter = router({
  submitMessage: publicProcedure
    .input(contactInputFormSchema)
    .mutation(async ({ input }) => {
      let { recipientUserId, ...contactData } = input;
      if (!recipientUserId) {
        const defaultUser = await User.findOne().sort({ createdAt: 1 }).lean();
        recipientUserId = defaultUser?._id ? String(defaultUser._id) : "";
      }
      if (!recipientUserId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Recipient User ID could not be determined",
        });
      }
      return createContactMessage(recipientUserId, contactData);
    }),

  getContactMessages: protectedProcedure
    .input(getContactMessagesSchema)
    .query(({ ctx, input }) => getContactMessages(ctx.session.user.id, input)),

  updateContactMessageReadStatus: protectedProcedure
    .input(toggleReadSchema)
    .mutation(({ ctx, input }) => updateContactMessageReadStatus(ctx.session.user.id, input)),

  archiveContactMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Id is required"),
      }),
    )
    .mutation(({ ctx, input }) => archiveContactMessage(ctx.session.user.id, input.id)),

  markAllRead: protectedProcedure.mutation(({ ctx }) => markAllRead(ctx.session.user.id)),

  getSingleContactMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "ID is required"),
      }),
    )
    .query(({ ctx, input }) => getSingleContactMessage(ctx.session.user.id, input.id)),

  deleteSingleContact: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Id is required"),
      }),
    )
    .mutation(({ ctx, input }) => deleteSingleContact(ctx.session.user.id, input.id)),

  updateStatus: protectedProcedure
    .input(updateStatusSchema)
    .mutation(({ ctx, input }) => updateStatus(ctx.session.user.id, input)),
});
