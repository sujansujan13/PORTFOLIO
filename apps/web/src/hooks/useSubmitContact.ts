// apps/web/src/hooks/useSubmitContact.ts
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";

export function useSubmitContact() {
  return useMutation(trpc.contact.submitMessage.mutationOptions());
}
