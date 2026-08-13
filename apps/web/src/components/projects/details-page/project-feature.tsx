"use client";

import { motion } from "framer-motion";
import { Zap, Layers, Compass, Boxes } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="w-5 h-5 text-amber-500" />,
  layers: <Layers className="w-5 h-5 text-amber-500" />,
  compass: <Compass className="w-5 h-5 text-amber-500" />,
  blocks: <Boxes className="w-5 h-5 text-amber-500" />,
};

export function ProjectFeatures({ features }: { features: Feature[] }) {
  return (
    <section className="pt-8 pb-4 space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-4 h-1 bg-primary rounded-full inline-block" />
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Key Features
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-6 bg-card/50 border border-border/80 rounded-xl space-y-3 hover:border-primary/50 transition-colors"
          >
            <div>
              {iconMap[feature.icon] ?? (
                <Zap className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <h3 className="text-base font-bold text-foreground">
              {feature.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
