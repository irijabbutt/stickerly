"use client";

import { useState } from "react";
import { motion } from "framer-motion";

function seeded(index: number, max: number) {
  // Deterministic pseudo-random values to avoid hydration mismatches
  const x = Math.sin(index * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * max;
}

// Japanese Neon Sign Component with Flicker
function NeonSign({
  text,
  top,
  left,
  color,
  vertical = false,
  delay = 0,
}: {
  text: string;
  top: string;
  left: string;
  color: "pink" | "cyan" | "yellow" | "purple";
  vertical?: boolean;
  delay?: number;
}) {
  const colorStyles = {
    pink: "text-pink-400 border-pink-500 shadow-[0_0_15px_rgba(244,114,182,0.6)]",
    cyan: "text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]",
    yellow: "text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]",
    purple: "text-purple-300 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.6)]",
  };

  return (
    <motion.div
      className={`absolute rounded-md border px-1.5 py-0.5 text-xs font-bold tracking-widest backdrop-blur-xs select-none ${
        colorStyles[color]
      } ${vertical ? "flex flex-col items-center leading-tight" : ""}`}
      style={{ top, left }}
      animate={{
        opacity: [0.85, 1, 0.4, 1, 0.9, 0.3, 1],
      }}
      transition={{
        duration: 3 + delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    >
      {text}
    </motion.div>
  );
}

// Traffic Light Streak for Rush Hour Speed Trails
function TrafficStreak({
  top,
  duration,
  delay,
  direction,
  color,
}: {
  top: string;
  duration: number;
  delay: number;
  direction: "left" | "right";
  color: "red" | "white" | "yellow";
}) {
  const colorGlow = {
    red: "bg-rose-500 shadow-[0_0_12px_#f43f5e]",
    white: "bg-slate-100 shadow-[0_0_12px_#ffffff]",
    yellow: "bg-amber-300 shadow-[0_0_12px_#fcd34d]",
  };

  const isLeft = direction === "left";

  return (
    <motion.div
      className={`absolute h-0.5 rounded-full ${colorGlow[color]}`}
      style={{
        top,
        width: 80 + Math.random() * 60,
      }}
      initial={{ x: isLeft ? "120%" : "-40%", opacity: 0.8 }}
      animate={{ x: isLeft ? "-40%" : "120%", opacity: 0.8 }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Cyberpunk / Anime Rain Particle
function RainDrop({
  left,
  delay,
  duration,
}: {
  left: string;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute h-10 w-0.5 rounded-full bg-gradient-to-b from-transparent via-purple-300/60 to-cyan-300/80"
      style={{ left }}
      initial={{ y: "-20%", opacity: 0 }}
      animate={{
        y: "120%",
        opacity: [0, 0.8, 0],
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
  const [trafficDensity, setTrafficDensity] = useState(1);

  // Deterministic Window Lights for Skyscrapers
  const skyscraperWindows = Array.from({ length: 48 }, (_, i) => ({
    top: `${15 + seeded(i, 55)}%`,
    left: `${seeded(i + 50, 95)}%`,
    isLit: seeded(i + 100, 10) > 3,
    color: seeded(i + 200, 10) > 5 ? "bg-amber-200/90" : "bg-cyan-200/90",
  }));

  // Generating Rush Hour Traffic Trails
  const trafficTrails = Array.from({ length: 20 * trafficDensity }, (_, i) => ({
    top: `${72 + seeded(i + 300, 22)}%`,
    duration: 1.8 + seeded(i + 400, 2.5),
    delay: seeded(i + 500, 4),
    direction: (i % 2 === 0 ? "left" : "right") as "left" | "right",
    color: (i % 3 === 0 ? "red" : i % 3 === 1 ? "white" : "yellow") as
      | "red"
      | "white"
      | "yellow",
  }));

  // Rain Drops
  const rain = Array.from({ length: 30 }, (_, i) => ({
    left: `${seeded(i + 600, 100)}%`,
    delay: seeded(i + 700, 3),
    duration: 0.8 + seeded(i + 800, 0.6),
  }));

  return (
    <div
      onClick={() => setTrafficDensity((prev) => (prev === 1 ? 2 : 1))}
      className="group relative h-full w-full cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-950 select-none"
      title="Click to toggle rush-hour traffic density!"
    >
      {/* Anime Night City Gradient Horizon & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-pink-600/30 via-purple-900/20 to-transparent" />
      <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />

      {/* Cyberpunk Distant Sky Grid / Moon */}
      <motion.div
        className="absolute left-[10%] top-[8%] h-20 w-20 rounded-full bg-gradient-to-tr from-pink-200 via-rose-100 to-white shadow-[0_0_50px_rgba(244,114,182,0.5)] sm:h-24 sm:w-24"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Background High Skyscraper Silhouettes */}
      <svg
        className="absolute bottom-0 left-0 w-full text-slate-950/90"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Layer 1: Distant Skyscrapers */}
        <path
          fill="currentColor"
          d="M0,500 L0,220 L40,220 L40,180 L80,180 L80,500 L120,500 L120,140 L190,140 L190,500 L240,500 L240,260 L290,260 L290,500 L350,500 L350,110 L440,110 L440,500 L500,500 L500,200 L560,200 L560,500 L620,500 L620,160 L700,160 L700,500 L760,500 L760,230 L820,230 L820,500 L890,500 L890,130 L960,130 L960,500 Z"
        />
      </svg>

      {/* Layer 2: Midground Buildings with Angle Cutouts */}
      <svg
        className="absolute bottom-0 left-0 w-full text-indigo-950/80"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,500 L0,300 L60,250 L110,250 L110,500 L170,500 L170,200 L210,170 L260,170 L260,500 L320,500 L320,320 L400,320 L400,500 L460,500 L460,240 L530,240 L530,500 L600,500 L600,280 L680,280 L680,500 L740,500 L740,190 L810,190 L810,500 L880,500 L880,310 L1000,310 L1000,500 Z"
        />
      </svg>

      {/* Skyscraper Lit Windows */}
      {skyscraperWindows.map((w, i) =>
        w.isLit ? (
          <div
            key={`window-${i}`}
            className={`absolute h-1.5 w-1 rounded-xs ${w.color} shadow-[0_0_6px_rgba(253,224,71,0.8)]`}
            style={{ top: w.top, left: w.left }}
          />
        ) : null
      )}

      {/* Japanese Neon Signs Floating on Buildings */}
      <NeonSign text="ステッカー" top="28%" left="18%" color="pink" vertical delay={0.2} />
      <NeonSign text="東京" top="22%" left="46%" color="cyan" delay={0.8} />
      <NeonSign text="ラ メン" top="36%" left="72%" color="yellow" vertical delay={1.4} />
      <NeonSign text="24H" top="18%" left="84%" color="purple" delay={0.5} />

      {/* Multi-tier Tokyo Highway Bridge / Overpass */}
      <div className="absolute top-[68%] left-0 h-4 w-full border-y border-pink-500/30 bg-slate-900/90 shadow-lg backdrop-blur-md">
        <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(236,72,153,0.2)_20px,rgba(236,72,153,0.2)_40px)]" />
      </div>

      {/* Main Wet Road Ground Reflection */}
      <div className="absolute bottom-0 left-0 h-[28%] w-full bg-gradient-to-t from-slate-950 via-indigo-950 to-slate-900">
        {/* Wet road neon reflection lines */}
        <div className="absolute top-0 h-full w-full opacity-40 bg-[radial-gradient(circle_at_50%_0%,_var(--tw-gradient-stops))] from-pink-500 via-purple-600 to-transparent blur-md" />
        {/* Road lane markers */}
        <div className="absolute top-1/2 left-0 h-0.5 w-full border-b border-dashed border-amber-300/40" />
      </div>

      {/* Busy Rush Hour Traffic Light Streaks */}
      {trafficTrails.map((t, i) => (
        <TrafficStreak key={`traffic-${i}`} {...t} />
      ))}

      {/* Foreground Anime Rain Effect */}
      {rain.map((r, i) => (
        <RainDrop key={`rain-${i}`} {...r} />
      ))}

      {/* Interactive Floating Badge */}
      <div className="absolute top-4 right-4 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-semibold text-pink-300 border border-pink-500/40 backdrop-blur-md transition-all group-hover:scale-105 group-hover:border-pink-400">
        ⚡ RUSH HOUR {trafficDensity > 1 ? "(HIGH)" : "(CLICK)"}
      </div>
    </div>
  );
}
