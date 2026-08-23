// packages/api/src/routers/contact.router.ts
import { protectedProcedure, publicProcedure, router } from "../index";
import { contactInputFormSchema } from "../schemas/Contact/contact-input.schema";
import { getContactMessagesSchema } from "../schemas/Contact/getContactMessage.schema";
import {
  createContactMessage,
  getContactMessages,
} from "../services/contact.service";

export const contactRouter = router({
  submitMessage: publicProcedure
    .input(contactInputFormSchema)
    .mutation(({ input }) => createContactMessage(input)),

  getContactMessages: protectedProcedure
    .input(getContactMessagesSchema)
    .query(({ input }) => getContactMessages(input)),
});
