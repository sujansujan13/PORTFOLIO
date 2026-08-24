// packages/api/src/routers/contact.router.ts
import { protectedProcedure, publicProcedure, router } from "../index";
import { contactInputFormSchema } from "../schemas/Contact/contact-input.schema";
import { getContactMessagesSchema } from "../schemas/Contact/getContactMessage.schema";
import { toggleReadSchema } from "../schemas/Contact/toggle-read.schema";
import {
  archiveContactMessage,
  createContactMessage,
  getContactMessages,
  getSingleContactMessage,
  markAllRead,
  updateContactMessageReadStatus,
} from "../services/contact.service";
import { z } from "zod";

export const contactRouter = router({
  submitMessage: publicProcedure
    .input(contactInputFormSchema)
    .mutation(({ input }) => createContactMessage(input)),

  getContactMessages: protectedProcedure
    .input(getContactMessagesSchema)
    .query(({ input }) => getContactMessages(input)),

  updateContactMessageReadStatus: protectedProcedure
    .input(toggleReadSchema)
    .mutation(({ input }) => updateContactMessageReadStatus(input)),

  archiveContactMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "Id is required"),
      }),
    )
    .mutation(({ input }) => archiveContactMessage(input.id)),

  markAllRead: protectedProcedure.mutation(() => markAllRead()),

  getSingleContactMessage: protectedProcedure
    .input(
      z.object({
        id: z.string().trim().min(1, "ID is required"),
      }),
    )
    .query(({ input }) => getSingleContactMessage(input.id)),
});
