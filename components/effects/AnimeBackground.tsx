"use client";

import { motion } from "framer-motion";

function seeded(index: number, max: number) {
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
      className="absolute rounded-full bg-white/70 blur-sm dark:bg-white/25"
      style={{
        top,
        width: 140 * scale,
        height: 48 * scale,
      }}
      initial={{ x: "-40%", opacity: 0.6 }}
      animate={{ x: "140%", opacity: 0.6 }}
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
      className="absolute rounded-full bg-amber-300 dark:bg-white"
      style={{ top, left, width: size, height: size }}
      animate={{ opacity: [0.15, 0.8, 0.15] }}
      transition={{
        duration: 2 + delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
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
      className="absolute rounded-full bg-rose-300/80 dark:bg-pink-300/80"
      style={{ left, width: size, height: size }}
      initial={{ y: "-10%", x: 0, rotate: 0, opacity: 0.8 }}
      animate={{
        y: "120vh",
        x: [0, 28, -24, 14, 0],
        rotate: [0, 120, 240, 360, 480],
        opacity: [0.8, 0.8, 0.5, 0.3, 0],
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

function ShootingStar({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute top-[15%] h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent dark:via-white"
      style={{ left: "-10%" }}
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: [0, "120vw"], opacity: [0, 1, 0] }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 7,
        ease: "easeIn",
      }}
    />
  );
}

export function AnimeBackground() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    top: `${seeded(i, 60)}%`,
    left: `${seeded(i + 100, 100)}%`,
    size: 1 + seeded(i + 200, 2.5),
    delay: seeded(i + 300, 3),
  }));

  const clouds = [
    { top: "10%", scale: 1.4, duration: 38, delay: 0 },
    { top: "20%", scale: 0.9, duration: 48, delay: 12 },
    { top: "6%", scale: 1.1, duration: 42, delay: 24 },
    { top: "16%", scale: 0.7, duration: 56, delay: 6 },
    { top: "28%", scale: 0.5, duration: 64, delay: 30 },
  ];

  const petals = Array.from({ length: 36 }, (_, i) => ({
    left: `${seeded(i + 400, 100)}%`,
    delay: seeded(i + 500, 10),
    duration: 10 + seeded(i + 600, 8),
    size: 5 + seeded(i + 700, 7),
  }));

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky-100 via-rose-100 to-amber-50 dark:from-indigo-950 dark:via-purple-900 dark:to-pink-900"
      aria-hidden="true"
    >
      <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-rose-400/20 blur-3xl dark:bg-pink-500/20" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20" />

      <motion.div
        className="absolute right-[10%] top-[8%] h-20 w-20 rounded-full bg-amber-200 shadow-[0_0_60px_rgba(251,191,36,0.5)] dark:bg-yellow-100 dark:shadow-[0_0_40px_rgba(253,224,71,0.6)] sm:h-28 sm:w-28"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {stars.map((s, i) => (
        <Star key={`bg-star-${i}`} {...s} />
      ))}

      {clouds.map((c, i) => (
        <Cloud key={`bg-cloud-${i}`} {...c} />
      ))}

      <ShootingStar delay={2} />
      <ShootingStar delay={9} />

      {petals.map((p, i) => (
        <Petal key={`bg-petal-${i}`} {...p} />
      ))}

      <svg
        className="absolute bottom-0 left-0 w-full text-emerald-300/60 dark:text-indigo-950/80"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,180 C220,110 440,200 660,140 C880,80 1100,170 1320,120 C1400,100 1420,140 1440,160 L1440,220 L0,220 Z"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-full text-emerald-200/40 dark:text-indigo-900/60"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,140 C260,70 520,160 780,110 C1040,60 1300,150 1440,100 L1440,180 L0,180 Z"
        />
      </svg>
    </div>
  );
}
