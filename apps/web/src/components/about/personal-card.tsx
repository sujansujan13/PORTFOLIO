"use client";

import React from "react";
import { motion } from "framer-motion";

interface PersonalCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  variants: any;
}

export function PersonalCard({
  icon,
  title,
  desc,
  variants,
}: PersonalCardProps) {
  return (
    <motion.div
      variants={variants}
      // #NEW# ->  whileHover={{ y: -4 }} -->
      whileHover={{ y: -4 }}
      className="p-5 bg-card/30 border border-border space-y-3 transition-all duration-300 hover:bg-card/80 hover:border-border/80 text-left rounded-lg"
    >
      <div className="p-2 w-fit bg-muted border border-border/40 rounded-sm">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-bold text-base  tracking-tight">{title}</h4>
        <p className="text-sm  text-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
