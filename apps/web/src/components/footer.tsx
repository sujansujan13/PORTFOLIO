"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowUp } from "lucide-react";

import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Social handles data mapping
  const socialLinks = [
    {
      href: "https://github.com",
      icon: <FaGithub className="h-4 w-4" />,
      label: "GitHub",
    },
    {
      href: "https://linkedin.com",
      icon: <FaLinkedin className="h-4 w-4" />,
      label: "LinkedIn",
    },
    {
      href: "https://twitter.com",
      icon: <FaXTwitter className="h-4 w-4" />,
      label: "Twitter",
    },
    {
      href: "mailto:your.email@example.com",
      icon: <Mail className="h-4 w-4" />,
      label: "Email",
    },
  ];

  // Smooth scroll back to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-background border-t border-[#444f62] text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 lg:px-8 space-y-8">
        {/* Top Section: Branding, Bio, and Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Brand Column */}
          <div className="space-y-3 max-w-md text-left">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Portfolio<span className="text-primary">.IO</span>
            </Link>
            <p className="text-xs sm:text-sm tex-muted-foreground font-semibold leading-relaxed ">
              Building robust and scalable full-stack applications with modern
              technologies. Based in Kathmandu, working globally.
            </p>
          </div>

          {/* Social Links Row (Aligned right on desktop, left on mobile) */}
          <div className="flex flex-wrap gap-4 md:justify-end items-center pt-2 md:pt-0">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                // to avoid Reverse Tabnabbing.
                //noopener -> "Open the new tab, but don't give it access to the original page."
                //noreferrer -> The destination website doesn't know which page you came from.
                rel="noopener noreferrer"
                aria-label={social.label}
                // Magnetic hover lift and color swap animation micro-interactions
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-(--card)/40 text-xs sm:text-sm font-medium text-foreground/80 transition-colors hover:text-primary hover:border-(--primary)/40 shadow-xs"
              >
                {social.icon}
                <span className="hidden sm:inline">{social.label}</span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Decorative Divider Line */}
        <hr className="border border-[#444f62]" />

        {/* Bottom Section: Copyright and Scroll to Top Anchor */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* #NEW#-> order-2 sm:order-1  */}
          <p className="order-2 sm:order-1 text-center sm:text-left">
            &copy; {currentYear} Built with MERN & Next.js. All rights reserved.
          </p>

          {/* Return To Top Action Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="order-1 sm:order-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-accent hover:text-foreground transition-colors cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-ring"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
