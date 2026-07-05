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
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Fake API
      await new Promise((resolve) => setTimeout(resolve, 1400));

      console.log(data);

      setIsSuccess(true);

      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const resetSuccess = () => {
    setIsSuccess(false);
  };

  return {
    ...form,

    onSubmit,

    isSuccess,

    resetSuccess,
  };
}
