"use client";

import { motion, useInView } from "motion/react";
import { useRef, useEffect } from "react";

function VideoCard({ theme, index }: { theme: { name: string; file: string }; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { amount: 0.3 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView) {
      video.play();
    } else {
      video.pause();
    }
  }, [isInView]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative aspect-video overflow-hidden rounded-xl border border-border/60 bg-muted/30"
    >
      <video
        ref={videoRef}
        src={`/videos/${theme.file}`}
        loop
        muted
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <span className="text-sm font-medium text-white">{theme.name}</span>
      </div>
    </motion.div>
  );
}

const themes = [
  { name: "Weather Field", file: "weather-1.mp4" },
  { name: "Contour Field", file: "contour-1.mp4" },
  { name: "Smoke Field", file: "smoke-1.mp4" },
  { name: "Magnetic Field", file: "magnetic-field-1.mp4" },
  { name: "Glyph Swarm", file: "glyph-swarm-1.mp4" },
  { name: "ASCII Field", file: "ascii-field-1.mp4" },
  { name: "Pulse Rings", file: "pulse-rings-1.mp4" },
];

export default function ThemeShowcase() {
  return (
    <section id="showcase" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-bold tracking-tight"
        >
          7 themes. Infinite moods.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-center text-muted-foreground"
        >
          Each one is a real-time physics simulation rendered on your GPU.
        </motion.p>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme, i) => (
            <VideoCard key={theme.file} theme={theme} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
