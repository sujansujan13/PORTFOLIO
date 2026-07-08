"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z
    .string()
    .email("Please provide a valid transmission email container address."),
});

type FormData = z.infer<typeof schema>;

export function NewsletterBox() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubscribe = async (data: FormData) => {
    setStatus("loading");
    try {
      // Intentionally simulating network latency pipeline behavior to demonstrate loading state
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="w-full bg-blue-600 dark:bg-blue-900 border border-border p-8 sm:p-12 text-center space-y-6 shadow-md transition-colors duration-300">
      <div className="space-y-2 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
          Stay Updated with My Latest Writing
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
          Get monthly technical articles on full-stack development,
          architectural patterns, and career growth sent straight to your inbox.
        </p>
      </div>

      {status === "success" ? (
        <div className="text-sm font-mono font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 py-3 px-4 inline-block">
          ✔ Ingestion Sequence Complete. Verification Token Transmitted.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubscribe)}
          className="max-w-2xl mx-auto space-y-2"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex-1 relative flex flex-col items-start">
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full h-11 bg-neutral-950/20 border border-blue-400/40 focus:border-white px-4 py-2 text-sm text-white placeholder:text-blue-200/60 focus:outline-none transition-colors duration-200"
                disabled={status === "loading"}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="h-11 px-6 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-neutral-950 font-mono font-black text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              {status === "loading" && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>Subscribe</span>
            </button>
          </div>

          {errors.email && (
            <p className="text-left text-xs font-mono text-rose-300 pt-1">
              {errors.email.message}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
