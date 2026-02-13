"use client";

import { useEffect, useRef, useCallback } from "react";

const REPULSION_RADIUS = 100;
const REPULSION_STRENGTH = 32;
const DOT_SIZE = 3;
const DOT_SPACING = 12;
const SPRING_STIFFNESS = 240;
const SPRING_DAMPING = 45;
const SPRING_MASS = 0.5;
const PROXIMITY_MULTIPLIER = 1.35;
const PROXIMITY_OPACITY_BOOST = 1.1;
const OPACITY_PULSE_SPEED = 0.8;

interface Dot {
  baseX: number;
  baseY: number;
  offsetX: number;
  offsetY: number;
  vx: number;
  vy: number;
  baseOpacity: number;
  opacity: number;
  phaseOffset: number;
}

function generateDots(width: number, height: number, spacing: number): Dot[] {
  const dots: Dot[] = [];
  const cols = Math.ceil(width / spacing);
  const rows = Math.ceil(height / spacing);
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const x = col * spacing;
      const y = row * spacing;

      const dx = x - centerX;
      const dy = y - centerY;
      const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
      const edgeFactor = Math.min(distanceFromCenter / (maxDistance * 0.7), 1);

      const keepChance = Math.min(0.4 + edgeFactor * 0.6, 1);
      if (Math.random() > keepChance) {
        continue;
      }

      const jitterStrength = spacing * 0.25;
      const jitterX = (Math.random() - 0.5) * jitterStrength;
      const jitterY = (Math.random() - 0.5) * jitterStrength;

      const pattern = (row + col) % 3;
      const baseOpacities = [0.3, 0.5, 0.7];
      const opacity = baseOpacities[pattern] * edgeFactor;

      dots.push({
        baseX: x + jitterX,
        baseY: y + jitterY,
        offsetX: 0,
        offsetY: 0,
        vx: 0,
        vy: 0,
        baseOpacity: opacity,
        opacity: opacity,
        phaseOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  return dots;
}

export default function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: Infinity, y: Infinity });
  const rafRef = useRef<number>(0);
  const isDarkRef = useRef(false);

  const initDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    dotsRef.current = generateDots(width, height, DOT_SPACING);
  }, []);

  useEffect(() => {
    initDots();

    const handleResize = () => initDots();
    window.addEventListener("resize", handleResize);

    // Check dark mode
    const checkDark = () => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: Infinity, y: Infinity };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [initDots]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap delta to avoid spiral
      lastTime = now;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = Number.isFinite(mx) && Number.isFinite(my);
      const dots = dotsRef.current;
      const time = now / 1000;

      const dotColor = isDarkRef.current ? "161, 161, 170" : "113, 113, 122"; // dark: zinc-400, light: zinc-500

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Compute target offset (with repulsion)
        let targetOffsetX = 0;
        let targetOffsetY = 0;

        if (mouseActive) {
          const dx = dot.baseX - mx;
          const dy = dot.baseY - my;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < REPULSION_RADIUS) {
            const pull = 1 - distance / REPULSION_RADIUS;
            const force = Math.pow(pull, 2) * REPULSION_STRENGTH;
            const angle = Math.atan2(dy, dx);
            targetOffsetX = Math.cos(angle) * force;
            targetOffsetY = Math.sin(angle) * force;
          }
        }

        // Spring physics toward target offset
        const forceX = SPRING_STIFFNESS * (targetOffsetX - dot.offsetX) - SPRING_DAMPING * dot.vx;
        const forceY = SPRING_STIFFNESS * (targetOffsetY - dot.offsetY) - SPRING_DAMPING * dot.vy;
        dot.vx += (forceX / SPRING_MASS) * dt;
        dot.vy += (forceY / SPRING_MASS) * dt;
        dot.offsetX += dot.vx * dt;
        dot.offsetY += dot.vy * dt;

        // Opacity: pulsing base + proximity boost
        const minOpacity = Math.max(dot.baseOpacity * 0.5, 0.3);
        const maxOpacity = Math.min(dot.baseOpacity * 1.5, 1);
        const pulse =
          (Math.sin(time * OPACITY_PULSE_SPEED * Math.PI * 2 + dot.phaseOffset) + 1) / 2;
        let opacity = minOpacity + (maxOpacity - minOpacity) * pulse;

        if (mouseActive) {
          const dist = Math.sqrt(
            (dot.baseX - mx) ** 2 + (dot.baseY - my) ** 2
          );
          const maxDist = REPULSION_RADIUS * PROXIMITY_MULTIPLIER;
          if (dist < maxDist) {
            const proximityFactor = 1 - dist / maxDist;
            opacity = Math.min(opacity + proximityFactor * PROXIMITY_OPACITY_BOOST, 1);
          }
        }

        // Draw
        ctx.beginPath();
        ctx.arc(dot.baseX + dot.offsetX, dot.baseY + dot.offsetY, DOT_SIZE / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
