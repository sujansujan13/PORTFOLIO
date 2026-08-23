import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import type { GetContactMessagesInput } from "@my-portfolio/api/schemas/Contact/getContactMessage.schema";

export function useContactMessages(options: GetContactMessagesInput) {
  return useQuery(trpc.contact.getContactMessages.queryOptions(options));
}
