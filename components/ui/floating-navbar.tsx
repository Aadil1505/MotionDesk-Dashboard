"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import React, {
  JSX,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

// Glass shadow effects - matching liquid-glass-card style
const GLASS_SHADOW_LIGHT =
  "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]";

const GLASS_SHADOW_DARK =
  "dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]";

const GLASS_SHADOW = `${GLASS_SHADOW_LIGHT} ${GLASS_SHADOW_DARK}`;

const DEFAULT_GLASS_FILTER_SCALE = 30;

// Glass filter SVG component
type GlassFilterProps = {
  id: string;
  scale?: number;
};

const GlassFilter = React.memo(
  ({ id, scale = DEFAULT_GLASS_FILTER_SCALE }: GlassFilterProps) => (
    <svg className="hidden">
      <title>Glass Effect Filter</title>
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          height="200%"
          id={id}
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feTurbulence
            baseFrequency="0.05 0.05"
            numOctaves="1"
            result="turbulence"
            seed="1"
            type="fractalNoise"
          />
          <feGaussianBlur
            in="turbulence"
            result="blurredNoise"
            stdDeviation="2"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            result="displaced"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="B"
          />
          <feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
);
GlassFilter.displayName = "GlassFilter";

export const FloatingNav = ({
  navItems,
  authSlot,
  themeSlot,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  authSlot?: ReactNode;
  themeSlot?: ReactNode;
  className?: string;
}) => {
  const filterId = React.useId();
  const [visible, setVisible] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sectionEntries = navItems
      .map((item, index) => {
        const hashIndex = item.link.indexOf("#");
        if (hashIndex === -1) {
          return null;
        }
        const sectionId = item.link.slice(hashIndex + 1);
        const section = document.getElementById(sectionId);
        if (!section) {
          return null;
        }
        return { section, index };
      })
      .filter(Boolean) as { section: Element; index: number }[];

    if (!sectionEntries.length) {
      return;
    }

    let frameId: number | null = null;

    const evaluateActive = () => {
      const scrollCenter = window.scrollY + window.innerHeight * 0.4;
      let best: { section: Element; index: number } | null = null;
      let bestDistance = Infinity;

      sectionEntries.forEach((entry) => {
        const rect = entry.section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionCenter = sectionTop + rect.height / 2;
        const distance = Math.abs(sectionCenter - scrollCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = entry;
        }
      });

      if (best) {
        const targetIndex = best.index;
        setActiveIndex((current) => (current === targetIndex ? current : targetIndex));
      }
    };

    const handleScroll = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      frameId = requestAnimationFrame(() => {
        evaluateActive();
        frameId = null;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [navItems]);

  useMotionValueEvent(scrollY, "change", (current) => {
    const direction = current - lastScrollY.current;
    lastScrollY.current = current;

    if (current < 100) {
      setVisible(true);
    } else if (direction < 0) {
      setVisible(true);
    } else if (direction > 3) {
      setVisible(false);
    }
  });

  return (
    <>
      <GlassFilter id={filterId} />
      <AnimatePresence mode="wait">
        <motion.div
          key="floating-nav"
          initial={{
            opacity: 1,
            y: 0,
          }}
          animate={{
            y: visible ? 0 : -120,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.25,
          }}
          className={cn(
            "group flex max-w-fit fixed top-10 inset-x-0 mx-auto rounded-full bg-background/20 backdrop-blur-[2px] z-5000 px-4 py-1.5 items-center justify-center gap-4 text-sm",
            className
          )}
        >
          {/* Glass shadow overlay */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full transition-all",
              GLASS_SHADOW
            )}
          />

          {/* Glass distortion filter */}
          <div
            className="-z-10 pointer-events-none absolute inset-0 isolate overflow-hidden rounded-full"
            style={{ backdropFilter: `url("#${filterId}")` }}
          />

          {/* Hover gradient overlay */}
          <div className="pointer-events-none absolute inset-0 z-20 rounded-full bg-linear-to-r from-transparent via-foreground/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          {/* Navigation items */}
          <div
            className="relative z-10 flex h-9 items-center gap-6 text-sm font-semibold tracking-wide sm:gap-8 sm:text-base"
          >
            {navItems.map((navItem, idx) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                aria-current={idx === activeIndex ? "page" : undefined}
                className={cn(
                  "relative z-10 inline-flex items-center px-2 transition-colors",
                  idx === activeIndex
                    ? "text-foreground"
                    : "text-muted-foreground/70 hover:text-foreground/90"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block whitespace-nowrap">{navItem.name}</span>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="relative z-10 h-4 w-px bg-border/50" />

          {/* Action buttons */}
          <div className="relative z-10 flex items-center gap-3">
            {themeSlot}
            {authSlot}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
