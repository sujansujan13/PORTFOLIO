"use client";
// installed dependencies: react-hook-form, zod, @hookform/resolvers, framer-motion, lucide-react

import { z } from "zod";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle } from "lucide-react";
import contactData from "@/data/contact-info.json";
import { useContactForm } from "@/hooks/useContactForm";
import { useState } from "react";

export function ContactForm() {
  // const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // we don't need to manage isSubmitting state manually because react-hook-form provides it out of the box.

  const { register, handleSubmit, errors, onSubmit, isSuccess, resetSuccess } =
    useContactForm();

  console.log(errors);

  return (
    <div className="w-full rounded-lg bg-card border border-border p-6 sm:p-8 space-y-6 shadow-xs">
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-4"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-black tracking-tight">
            Transmission Verified
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Your inquiry dataset has successfully transitioned into our
            communication streams. I will review and follow up shortly.
          </p>
          <button
            onClick={resetSuccess}
            className="text-xs font-mono font-bold tracking-wider uppercase text-primary hover:underline pt-2 cursor-pointer"
          >
            Send Another Payload
          </button>
        </motion.div>
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Grid setup for Name and Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-mono font-bold tracking-wide uppercase text-foreground/80"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className="w-full bg-background/50 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors duration-200"
              />
              {errors.name?.message && (
                <p className="text-xs font-mono text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-mono font-bold tracking-wide uppercase text-foreground/80"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className="w-full bg-background/50 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors duration-200"
              />
              {errors.email?.message && (
                <p className="text-xs font-mono text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Context Option Selector Dropdown */}
          <div className="space-y-1.5">
            <label
              htmlFor="subject"
              className="text-xs font-mono font-bold tracking-wide uppercase text-foreground/80"
            >
              Subject Context
            </label>
            <div className="relative">
              <select
                id="subject"
                {...register("subject")}
                className="w-full bg-background/50 border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 appearance-none transition-colors duration-200"
              >
                <option
                  value=""
                  disabled
                  className="bg-card text-muted-foreground"
                >
                  Select coordination path...
                </option>
                {contactData.subjects.map((subj) => (
                  <option
                    key={subj.value}
                    value={subj.value}
                    className="bg-card text-foreground"
                  >
                    {subj.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                <svg
                  className="fill-current h-4 w-4 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {errors.subject?.message && (
              <p className="text-xs font-mono text-destructive mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Large Message Area Box */}
          <div className="space-y-1.5">
            <label
              htmlFor="message"
              className="text-xs font-mono font-bold tracking-wide uppercase text-foreground/80"
            >
              Your Message
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Describe your vision or structural integration query..."
              {...register("message")}
              className="w-full bg-background/50 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none transition-colors duration-200"
            />
            {errors.message?.message && (
              <p className="text-xs font-mono text-destructive mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Action Trigger Button Segment */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-bold text-sm uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer group"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing Sync...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
