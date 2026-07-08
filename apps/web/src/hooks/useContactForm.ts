"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  type ContactFormValues,
} from "@/schemas/contact.schema";

export function useContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    // ✅ ADD THESE OPTIONS
    mode: "onSubmit", // Validate on submit (not on change)
    reValidateMode: "onChange", // Re-validate on change after first error
    shouldFocusError: true, // Focus first error field
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Fake API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form Data:", data);

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
  };
}
