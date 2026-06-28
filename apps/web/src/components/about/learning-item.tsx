"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface LearningItemProps {
  title: string;
  desc: string;
  color: string;
  variants: any;
}

export function LearningItem({
  title,
  desc,
  color,
  variants,
}: LearningItemProps) {
  return (
    <motion.div
      variants={variants}
      className="group flex items-center justify-between p-6 bg-card/40 border border-border hover:border-primary/30 transition-all duration-300 rounded-sm"
    >
      <div className="flex items-start gap-3.5 pr-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${color} mt-2 shrink-0 animate-pulse`}
        />
        <div>
          <h4 className="font-bold text-base  tracking-tight group-hover:text-primary transition-colors duration-200">
            {title}
          </h4>
          <p className="text-xs font-semibold text-foreground line-clamp-1">
            {desc}
          </p>
        </div>
      </div>
      <ArrowRight className="h-6 w-6 text-blue-200 transform -translate-x-1 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300 shrink-0" />
    </motion.div>
  );
}
