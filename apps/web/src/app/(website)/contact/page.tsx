import React from "react";
import { type Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactMeta } from "@/components/contact/contact-meta";

// --- VALIDATED SCHEMATIC SEO ROUTING OBJECT ---
export const metadata: Metadata = {
  title: "Contact & Collaborations | Sujan Raj Pandey",
  description:
    "Connect directly with Sujan Raj Pandey for full-stack software initiatives, tRPC system engineering architectures, or internship coordination tracks.",
  openGraph: {
    title: "Contact & Collaborations | Sujan Raj Pandey",
    description:
      "Submit communication payloads directly through a secure communication gateway or review localized network connection vectors.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="w-full min-h-screen bg-background text-foreground selection:bg-primary/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* Core Narrative Hero Row Block */}
        <header className="space-y-3 text-left max-w-2xl">
          <span className="text-xs md:text-[10px] font-mono font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1">
            Secure Endpoint Connection
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-none">
            Let's build something{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-chart-1">
              meaningful
            </span>
            .
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed font-medium">
            Whether you have a specific system migration path in mind or just
            want to discuss current full-stack paradigms, my ingestion pipelines
            are open.
          </p>
        </header>

        {/* Adaptive Layout Matrix Blueprint Grid Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dynamic Interactive Input Node: Form Space */}
          <div className="lg:col-span-7 xl:col-span-8 w-full">
            <ContactForm />
          </div>

          {/* Collateral Verification Streams: Meta Data Space */}
          <div className="lg:col-span-5 xl:col-span-4 w-full">
            <ContactMeta />
          </div>
        </div>
      </div>
    </main>
  );
}
