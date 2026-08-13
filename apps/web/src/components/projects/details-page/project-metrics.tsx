"use client";

import { motion } from "framer-motion";

interface Metric {
  value: string;
  label: string;
}

export function ProjectMetrics({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="py-8 my-6 border-y border-border/60">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="space-y-1"
          >
            <div className="text-3xl sm:text-4xl font-black text-amber-500 tracking-tight">
              {metric.value}
            </div>
            <div className="text-xs sm:text-sm font-medium text-muted-foreground">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
