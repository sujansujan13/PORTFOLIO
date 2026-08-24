import React from "react";
import { motion } from "framer-motion";

interface MarkAllModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function MarkAllModal({
  title,
  onConfirm,
  onCancel,
}: MarkAllModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 5 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="w-full min-w-64 rounded-xl border border-border bg-card px-4 py-3 text-card-foreground shadow-xl transition-all duration-200"
    >
      <h2 className="text-base font-semibold tracking-tight text-red-400 text-center">
        {title}
      </h2>

      <div className="mt-2 flex items-center justify-center gap-3">
        <button
          onClick={onCancel}
          className="w-fit rounded-lg border border-border bg-transparent px-1.5 py-1 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
        >
          No
        </button>
        <button
          onClick={onConfirm}
          className="w-fit rounded-lg bg-primary px-1.5 py-1 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98]"
        >
          Yes
        </button>
      </div>
    </motion.div>
  );
}
