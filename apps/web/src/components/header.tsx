"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
// #NEW#
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
// #NEW->useSelectedLayoutSegment
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  const links = [
    { to: "/", label: "Home", segment: null },
    { to: "/about", label: "About", segment: "about" },
    { to: "/projects", label: "Projects", segment: "projects" },
    { to: "/experience", label: "Experience", segment: "experience" },
    { to: "/blog", label: "Blog", segment: "blog" },
    { to: "/contact", label: "Contact", segment: "contact" },
  ] as const;

  const isActive = (linkSegment: string | null) => {
    if (linkSegment === null) return pathname === "/";
    return segment === linkSegment;
  };

  // Underline variants for animation
  const underlineVariants = {
    hidden: {
      scaleX: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        delay: 0.1,
      },
    },
    exit: {
      scaleX: 0,
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  } as const; // Add 'as const' to satisfy TypeScript;

  // Hover underline animation
  const hoverUnderlineVariants = {
    initial: {
      scaleX: 0,
      opacity: 0,
    },
    hover: {
      scaleX: 1,
      opacity: 0.5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      scaleX: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  } as const; // ✅ Add 'as const' to satisfy TypeScript;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-(--background)/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 xl:px-16">
        {/* Logo / Branding */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Portfolio<span className="text-primary">.IO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {links.map(({ to, label, segment }) => {
            const active = isActive(segment);
            return (
              <Link
                key={to}
                href={to}
                className={cn(
                  "relative dark:text-[#d2e4fe] hover:text-primary transition-colors font-sans",
                  "pb-1",
                  active && "font-bold scale-90",
                )}
              >
                {label}

                {/* Active Underline with Animation */}
                <AnimatePresence mode="wait">
                  {active && (
                    <motion.span
                      className="absolute left-0 bottom-0 h-0.75 w-full bg-primary rounded-full"
                      variants={underlineVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={{
                        originX: 0,
                        bottom: "-2px",
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Hover Underline Animation (only when not active) */}
                {!active && (
                  <motion.span
                    className="absolute left-0 bottom-0 h-0.75 w-full bg-primary/50 rounded-full"
                    variants={hoverUnderlineVariants}
                    initial="initial"
                    whileHover="hover"
                    exit="exit"
                    style={{
                      originX: 0,
                      bottom: "-2px",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side utilities (Theme, User, Mobile Toggle) */}
        <div className="flex items-center gap-3">
          <ModeToggle />
          <UserMenu />

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 text-foreground rounded-md hover:bg-accent transition-colors focus:outline-none"
                  aria-label="Toggle Menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-75 bg-background border-l border-border p-6 pt-16"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                <nav className="flex flex-col gap-5 text-lg font-medium mt-4">
                  {links.map(({ to, label, segment }) => {
                    const active = isActive(segment);
                    return (
                      <Link
                        key={to}
                        href={to}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "text-foreground dark:text-[#d2e4fe] hover:text-primary transition-colors py-2 border-b border-(--border)/40",
                          active &&
                            "text-primary dark:text-primary underline underline-offset-6 ",
                        )}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
