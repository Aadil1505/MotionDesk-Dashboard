"use client";

import { motion } from "motion/react";
import {
  Monitor,
  MousePointerClick,
  Cpu,
  Palette,
  Zap,
  SlidersHorizontal,
} from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Multi-display support",
    description: "Seamlessly spans across all your screens.",
  },
  {
    icon: MousePointerClick,
    title: "Cursor-responsive physics",
    description: "Every theme reacts to your mouse in real time.",
  },
  {
    icon: Cpu,
    title: "GPU-accelerated",
    description: "Metal-powered rendering. Silky smooth, battery-friendly.",
  },
  {
    icon: Palette,
    title: "10+ distinct themes",
    description: "Customize your vibe from weather fields to glyph swarms.",
  },
  {
    icon: Zap,
    title: "Autopilot mode",
    description: "Sit back and let the wallpaper animate itself.",
  },
  {
    icon: SlidersHorizontal,
    title: "Granular customization",
    description: "Fine-tune colors, speed, density, and more.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-bold tracking-tight"
        >
          Built For Your Mac
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-center text-muted-foreground"
        >
          A wallpaper engine for your Mac that actually feels good.
        </motion.p>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="space-y-3"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="size-5 text-foreground" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
