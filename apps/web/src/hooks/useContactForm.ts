"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactInputFormSchema,
  type ContactInputValues,
} from "@/schemas/contact-form.schema";
import { useSubmitContact } from "./useSubmitContact";

export function useContactForm(recipientUserId?: string) {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactInputValues>({
    resolver: zodResolver(contactInputFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "collaboration",
      message: "",
    },
    // ✅ ADD THESE OPTIONS
    mode: "onSubmit", // Validate on submit (not on change)
    reValidateMode: "onChange", // Re-validate on change after first error
    shouldFocusError: true, // Focus first error field
  });

  const submitContact = useSubmitContact();

  const onSubmit = async (data: ContactInputValues) => {
    try {
      await submitContact.mutateAsync({
        ...data,
        ...(recipientUserId ? { recipientUserId } : {}),
      });
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const resetSuccess = () => {
    setIsSuccess(false);
  };

  // rarely use spread operator to pass all form methods and state, but here we are destructuring for clarity
  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    onSubmit,
    isSuccess,
    resetSuccess,
    isSubmiting: form.formState.isSubmitting || submitContact.isPending,
  };
}
