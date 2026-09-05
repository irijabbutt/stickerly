"use client";

import { motion } from "framer-motion";

function seeded(index: number, max: number) {
  // Deterministic pseudo-random values to avoid hydration mismatches.
  const x = Math.sin(index * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * max;
}

function Cloud({
  top,
  scale,
  duration,
  delay,
}: {
  top: string;
  scale: number;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-white/80 blur-sm"
      style={{
        top,
        width: 120 * scale,
        height: 40 * scale,
      }}
      initial={{ x: "-30%", opacity: 0.7 }}
      animate={{ x: "130%", opacity: 0.7 }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function Star({
  top,
  left,
  size,
  delay,
}: {
  top: string;
  left: string;
  size: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{ top, left, width: size, height: size }}
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: 2 + delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Petal({
  left,
  delay,
  duration,
  size,
}: {
  left: string;
  delay: number;
  duration: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-pink-300/80"
      style={{ left, width: size, height: size }}
      initial={{ y: "-10%", x: 0, rotate: 0, opacity: 0.8 }}
      animate={{
        y: "110vh",
        x: [0, 20, -20, 10, 0],
        rotate: [0, 90, 180, 270, 360],
        opacity: [0.8, 0.8, 0.6, 0.4, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export function AnimeScene() {
  const clouds = [
    { top: "12%", scale: 1.2, duration: 28, delay: 0 },
    { top: "22%", scale: 0.8, duration: 36, delay: 8 },
    { top: "8%", scale: 1.0, duration: 32, delay: 16 },
    { top: "18%", scale: 0.6, duration: 44, delay: 4 },
  ];

  const stars = Array.from({ length: 36 }, (_, i) => ({
    top: `${seeded(i, 55)}%`,
    left: `${seeded(i + 100, 100)}%`,
    size: 1 + seeded(i + 200, 2),
    delay: seeded(i + 300, 3),
  }));

  const petals = Array.from({ length: 24 }, (_, i) => ({
    left: `${seeded(i + 400, 100)}%`,
    delay: seeded(i + 500, 8),
    duration: 8 + seeded(i + 600, 6),
    size: 6 + seeded(i + 700, 6),
  }));

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-700">
      {/* Soft glow orbs */}
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />

      {/* Moon */}
      <motion.div
        className="absolute right-[12%] top-[10%] h-20 w-20 rounded-full bg-yellow-100 shadow-[0_0_40px_rgba(253,224,71,0.6)] sm:h-24 sm:w-24"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Stars */}
      {stars.map((s, i) => (
        <Star key={`star-${i}`} {...s} />
      ))}

      {/* Clouds */}
      {clouds.map((c, i) => (
        <Cloud key={`cloud-${i}`} {...c} />
      ))}

      {/* Falling petals */}
      {petals.map((p, i) => (
        <Petal key={`petal-${i}`} {...p} />
      ))}

      {/* Hills / skyline silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full text-indigo-950/80"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,160 C200,100 400,180 600,130 C800,80 1000,150 1200,110 C1350,80 1400,120 1440,140 L1440,200 L0,200 Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-full text-indigo-900/60"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,120 C240,60 480,140 720,100 C960,60 1200,130 1440,90 L1440,160 L0,160 Z"
        />
      </svg>
    </div>
  );
}
