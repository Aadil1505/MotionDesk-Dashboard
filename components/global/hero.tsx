"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { AuroraText } from "../ui/aurora-text";

export default function Hero() {
  return (
    <section className="flex flex-col items-center pt-40 pb-8 px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl"
      >
        Your Mac, <AuroraText colors={["#f8f8f8", "#90D5FF"]}>Alive.</AuroraText>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-6 max-w-lg text-lg text-muted-foreground"
      >
        GPU-accelerated live wallpapers for macOS. 7 physics-driven themes that
        react to your cursor, span every display, and never skip a frame.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex gap-4"
      >
        <Button size="lg" asChild>
          <Link href="#pricing">
            Get FluidField
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="#showcase">Watch it move</Link>
        </Button>
      </motion.div>
    </section>
  );
}
