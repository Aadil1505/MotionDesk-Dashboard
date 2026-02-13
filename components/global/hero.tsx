"use client";

import { Button } from "@/components/ui/button";
import DownloadButton from "@/components/global/download-button";
import { LiquidGlassCard } from "@/components/kokonutui/liquid-glass-card";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { AuroraText } from "../ui/aurora-text";

export default function Hero() {
  return (
    <section className="flex flex-col items-center pt-40 pb-8 px-6 text-center">
      {/* App icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-5"
      >
        <LiquidGlassCard className="size-20 sm:size-24 rounded-[22.37%] p-2 overflow-hidden">
          <Image
            src="/web-app-manifest-192x192.png"
            alt="MotionDesk"
            fill
            className="absolute inset-0 size-full object-cover rounded-[22.37%]"
            priority
          />
        </LiquidGlassCard>
      </motion.div>

      {/* App name */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
      >
        MotionDesk
      </motion.p>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
      >
        Your Mac&apos;s Wallpaper, <AuroraText className="italic" colors={["#f8f8f8", "#90D5FF"]}>Alive.</AuroraText>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-5 max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed"
      >
        GPU-accelerated live wallpapers for macOS.
        10+ physics-driven themes that
        react to your cursor, breathe, and span every display.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-8 flex gap-4"
      >
        <DownloadButton />
        <Button variant="outline" size="lg" asChild>
          <Link href="/#showcase">Watch it move</Link>
        </Button>
      </motion.div>
    </section>
  );
}
