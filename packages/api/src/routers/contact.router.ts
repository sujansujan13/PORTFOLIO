// packages/api/src/routers/contact.router.ts
import { publicProcedure, router } from "../index";
import { contactInputFormSchema } from "../schemas/Contact/contact-input.schema";
import { createContactMessage } from "../services/contact.service";

export const contactRouter = router({
  submitMessage: publicProcedure
    .input(contactInputFormSchema)
    .mutation(({ input }) => createContactMessage(input)),
});
