"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkillCardProps {
  id: string;
  title: string;
  subtitle: string;
  percentage: number;
  icon: React.ReactNode;
  trackColor: string;
}

export function SkillCard({
  title,
  subtitle,
  percentage,
  icon,
  trackColor,
}: SkillCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="p-5 sm:p-6 bg-card border border-border flex flex-col justify-between space-y-6 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-muted border border-border/80 rounded-sm">
            {icon}
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg sm:text-lg tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-foreground font-medium">{subtitle}</p>
          </div>
        </div>
        <span className="text-xs sm:text-sm font-mono font-bold text-foreground/80">
          {percentage}%
        </span>
      </div>

      {/* Meter Track Progression Component */}
      <div className="w-full h-1.5 bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className={`h-full ${trackColor}`}
        />
      </div>
    </motion.div>
  );
}
