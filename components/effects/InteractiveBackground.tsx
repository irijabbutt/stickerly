"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function InteractiveBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 60 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950 select-none"
      aria-hidden="true"
    >
      {/* Anime City Loop Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover opacity-70 dark:opacity-45 transition-opacity duration-500"
      >
        <source src="/anime-city.mp4" type="video/mp4" />
      </video>

      {/* Interactive Mouse-Following Ambient Spotlight */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-400/20 dark:bg-pink-500/15 blur-3xl"
        style={{
          left: dx,
          top: dy,
        }}
      />

      {/* Gradient Vignette Overlays for UI & Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/90" />
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-background/30 to-background/70" />
    </div>
  );
}
