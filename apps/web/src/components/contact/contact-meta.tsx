"use client";

import React from "react";
import { Mail, MapPin } from "lucide-react";
import contactData from "@/data/contact-info.json";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6"; // Fixed the syntax error here

/**
 * Using React.ComponentType allows this map to accept components from ANY icon library
 * (LucideIcon, IconType, etc.) as long as they take standard SVG/React props.
 */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github: FaGithub,
  Linkedin: FaLinkedin,
  Twitter: FaXTwitter,
};

export function ContactMeta() {
  return (
    <div className="space-y-6">
      {/* 1. Primary Direct Channels Box */}
      <div className="bg-card border border-border p-6 space-y-5 shadow-xs rounded-lg">
        {/* Email Node Item */}
        <div className="flex items-start gap-4 group">
          <div className="p-3 bg-muted border border-border text-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Email Me
            </span>
            <p className="text-base sm:text-lg font-extrabold text-foreground tracking-tight hover:text-primary transition-colors duration-200">
              <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
            </p>
          </div>
        </div>

        {/* Geographic Base Node Item */}
        <div className="flex items-start gap-4 group">
          <div className="p-3 bg-muted border border-border text-foreground transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Location
            </span>
            <p className="text-base sm:text-lg font-extrabold text-foreground tracking-tight">
              {contactData.location}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Abstract Stylized Geographic Visual Component */}
      <div className="relative h-44 w-full bg-neutral-900 overflow-hidden border border-border group rounded-lg">
        <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[16px_16px]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-neutral-950/80 z-10" />
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity transform scale-100 transition-transform duration-700 ease-out group-hover:scale-103 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center" />

        {/* Realtime Active Location Pulse Badge */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-background/90 border border-border px-2.5 py-1 backdrop-blur-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex bg-amber-500 h-2 w-2" />
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-foreground">
            Currently in {contactData.location.split(",")[0]}
          </span>
        </div>
      </div>

      {/* 3. Social Integration Matrix Grid */}
      <div className="grid grid-cols-3 gap-3">
        {contactData.socials.map((social) => {
          // Fallback to FaGithub if the dynamic lookup doesn't hit a key
          const IconComp = iconMap[social.icon] || FaGithub;
          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border p-4 flex flex-col items-center justify-center gap-2 text-center group hover:border-primary/40 hover:shadow-lg hover:shadow-primary/1 transition-all rounded-lg duration-300"
              title={`Establish interaction via ${social.platform}`}
            >
              <IconComp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
              <span className="text-xs font-mono font-bold tracking-tight text-foreground/90">
                {social.platform}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
