"use client";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { JSX, ReactNode, useRef, useState } from "react";

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
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (current) => {
    const direction = current - lastScrollY.current;
    lastScrollY.current = current;

    if (current < 100) {
      setVisible(true);
    } else if (direction < 0) {
      setVisible(true);
    } else if (direction > 1) {
      setVisible(false);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border rounded-full bg-background shadow-lg z-5000 pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            className={cn(
              "relative items-center flex space-x-1 text-muted-foreground hover:text-muted-foreground/80"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </a>
        ))}
        {themeSlot}
        {authSlot}
      </motion.div>
    </AnimatePresence>
  );
};
