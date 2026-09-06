"use client";

import { motion } from "framer-motion";

function seeded(index: number, max: number) {
  const x = Math.sin(index * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * max;
}

export function AnimeScene() {
  const clouds = Array.from({ length: 6 }, (_, i) => ({
    top: `${4 + seeded(i, 18)}%`,
    scale: 0.9 + seeded(i + 10, 0.7),
    duration: 35 + seeded(i + 20, 25),
    delay: seeded(i + 30, 10),
  }));

  const pedestrians = Array.from({ length: 7 }, (_, i) => ({
    bottom: `${26 + seeded(i + 50, 4)}%`,
    duration: 16 + seeded(i + 60, 10),
    delay: seeded(i + 70, 8),
    direction: (i % 2 === 0 ? "left" : "right") as "left" | "right",
    scale: 0.65 + seeded(i + 80, 0.2),
  }));

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-950 select-none">
      {/* 1. Golden Sunset Gradient Sky */}
      <div className="absolute inset-0 h-[65%] bg-gradient-to-b from-amber-300 via-orange-500 via-rose-600 to-indigo-950" />
      
      {/* Sun Glow Bloom */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-amber-100/50 blur-3xl" />

      {/* 2. Soft Drifting Sunset Clouds */}
      {clouds.map((c, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute rounded-full bg-gradient-to-r from-amber-100/60 via-orange-200/50 to-pink-300/30 blur-md"
          style={{ top: c.top, width: 160 * c.scale, height: 40 * c.scale }}
          initial={{ x: "-20vw" }}
          animate={{ x: "110vw" }}
          transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* 3. Deep Background Skyline & Tokyo/Seoul Tower Silhouette */}
      <svg className="absolute top-[18%] left-0 w-full h-[45%] text-indigo-950/70" viewBox="0 0 1000 400" preserveAspectRatio="none">
        {/* Distant Comm Tower */}
        <path fill="currentColor" d="M 495 40 L 505 40 L 503 160 L 515 220 L 515 400 L 485 400 L 485 220 L 497 160 Z" />
        {/* Distant Highrises */}
        <path fill="currentColor" d="M 0 400 L 0 280 L 120 280 L 120 400 L 250 400 L 250 220 L 380 220 L 380 400 L 620 400 L 620 250 L 750 250 L 750 400 L 1000 400 L 1000 500 L 0 500 Z" />
      </svg>

      {/* 4. Overhead Power Wires & Telephone Poles */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none z-10 opacity-70">
        <path d="M 0 20 Q 300 90, 600 30 T 1200 50" fill="none" stroke="#0f172a" strokeWidth="2" />
        <path d="M 0 35 Q 400 110, 800 40 T 1200 70" fill="none" stroke="#0f172a" strokeWidth="1.5" />
        <path d="M 0 50 Q 200 100, 500 45 T 1200 85" fill="none" stroke="#0f172a" strokeWidth="1" />
      </svg>

      {/* 5. Detailed Midground Storefronts & Urban Buildings (Left & Right Perspective Sides) */}
      <svg className="absolute inset-0 h-full w-full z-10" viewBox="0 0 1000 500" preserveAspectRatio="none">
        <defs>
          <linearGradient id="leftBuildingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="rightBuildingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#31103f" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <filter id="neonGlowOrange" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f97316" />
          </filter>
          <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" />
          </filter>
        </defs>

        {/* Left Side Buildings */}
        <path fill="url(#leftBuildingGrad)" d="M 0 0 L 280 100 L 280 400 L 0 440 Z" />
        {/* Left Windows & Lit Awnings */}
        <rect x="20" y="80" width="35" height="50" rx="3" fill="#fef08a" opacity="0.85" />
        <rect x="80" y="100" width="40" height="60" rx="3" fill="#f97316" opacity="0.75" />
        <rect x="140" y="120" width="35" height="55" rx="3" fill="#38bdf8" opacity="0.8" />
        <rect x="0" y="320" width="220" height="12" fill="#f97316" filter="url(#neonGlowOrange)" />

        {/* Right Side Buildings */}
        <path fill="url(#rightBuildingGrad)" d="M 1000 0 L 720 100 L 720 400 L 1000 440 Z" />
        {/* Right Storefront Awnings & Vertical Neon Banners */}
        <rect x="760" y="120" width="18" height="90" rx="2" fill="#ec4899" filter="url(#neonGlowOrange)" />
        <rect x="840" y="80" width="22" height="110" rx="2" fill="#38bdf8" filter="url(#neonGlowCyan)" />
        <rect x="720" y="310" width="280" height="14" fill="#facc15" filter="url(#neonGlowOrange)" />

        {/* Lit Interior Windows on Right */}
        <rect x="760" y="220" width="45" height="60" rx="3" fill="#fde047" opacity="0.9" />
        <rect x="830" y="240" width="45" height="60" rx="3" fill="#fb923c" opacity="0.8" />
      </svg>

      {/* 6. Korean / Japanese Neon Text Overlays */}
      <div className="absolute top-[28%] left-[8%] z-20 flex flex-col items-center border border-amber-400 bg-amber-500/20 px-2 py-1 rounded text-amber-300 font-black text-xs shadow-[0_0_12px_#f59e0b] backdrop-blur-xs">
        <span>강남</span>
        <span>포차</span>
      </div>
      <div className="absolute top-[22%] right-[18%] z-20 border border-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300 font-bold text-xs shadow-[0_0_12px_#06b6d4] backdrop-blur-xs">
        GS25
      </div>

      {/* 7. Sidewalks & Walking Pedestrians */}
      {pedestrians.map((p, i) => (
        <motion.div
          key={`pedestrian-${i}`}
          className="absolute z-20 flex flex-col items-center"
          style={{ bottom: p.bottom }}
          initial={{ x: p.direction === "left" ? "105vw" : "-10vw" }}
          animate={{ x: p.direction === "left" ? "-10vw" : "105vw" }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            style={{ scale: p.scale }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <div className="h-3 w-3 rounded-full bg-slate-900" />
            <div className="h-6 w-3.5 rounded-xs bg-slate-900 border-t-2 border-amber-400/60" />
            <div className="flex gap-1">
              <div className="h-4 w-1 bg-slate-950" />
              <div className="h-4 w-1 bg-slate-950" />
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* 8. Wet Road Ground & Realistic Reflections */}
      <div className="absolute bottom-0 inset-x-0 h-[28%] z-20 bg-gradient-to-t from-slate-950 via-indigo-950 to-slate-900 border-t border-amber-500/40">
        {/* Wet Street Reflections Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/30 via-rose-500/20 to-transparent blur-md" />
        <div className="absolute top-1/2 inset-x-0 h-0.5 border-b border-dashed border-amber-400/30" />
      </div>

      {/* 9. Moving Traffic Cars (Midground) */}
      <motion.div
        className="absolute bottom-[16%] z-20 flex items-center"
        initial={{ x: "-20vw" }}
        animate={{ x: "110vw" }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 2 }}
      >
        {/* Midground SUV / Taxi */}
        <div className="relative h-7 w-20 rounded-t-md bg-slate-900 border-t border-amber-400/50">
          <div className="absolute -top-3 left-4 h-3 w-11 rounded-t-md bg-slate-800" />
          <div className="absolute bottom-1 right-0 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]" />
          <div className="absolute bottom-1 left-0 h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
        </div>
      </motion.div>

      {/* 10. Hero Tuner Sports Car (Foreground - Inspired by the Reference Image) */}
      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="320" height="110" viewBox="0 0 320 110" fill="none">
          {/* Cyan Underglow Reflection on Wet Pavement */}
          <ellipse cx="160" cy="100" rx="130" ry="8" fill="#38bdf8" opacity="0.85" className="blur-xs" />

          {/* Car Ground Shadow */}
          <rect x="20" y="85" width="280" height="15" rx="7" fill="#020617" opacity="0.95" />

          {/* Widebody Rear Bumper & Fenders */}
          <path d="M 15 88 L 40 55 L 280 55 L 305 88 L 290 98 L 30 98 Z" fill="#030712" />
          <path d="M 25 88 L 45 58 L 275 58 L 295 88 L 280 96 L 40 96 Z" fill="#0284c7" />

          {/* Rear Windshield & Roof Pillars */}
          <path d="M 65 58 L 90 26 L 230 26 L 255 58 Z" fill="#020617" />
          <path d="M 74 55 L 94 30 L 226 30 L 246 55 Z" fill="#38bdf8" opacity="0.3" />

          {/* GT Wing Spoiler */}
          <rect x="45" y="18" width="230" height="5" rx="2" fill="#0f172a" />
          <rect x="80" y="23" width="8" height="10" fill="#020617" />
          <rect x="232" y="23" width="8" height="10" fill="#020617" />

          {/* Iconic Quad Round Tail Lights (Skyline Style) */}
          <circle cx="68" cy="73" r="9" fill="#ef4444" className="shadow-[0_0_15px_#ef4444]" />
          <circle cx="92" cy="73" r="9" fill="#ef4444" className="shadow-[0_0_15px_#ef4444]" />
          <circle cx="228" cy="73" r="9" fill="#ef4444" className="shadow-[0_0_15px_#ef4444]" />
          <circle cx="252" cy="73" r="9" fill="#ef4444" className="shadow-[0_0_15px_#ef4444]" />

          {/* License Plate */}
          <rect x="135" y="70" width="50" height="16" rx="2" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
          <text x="160" y="82" fontSize="9" fontWeight="900" fill="#0f172a" textAnchor="middle">
            서울 330
          </text>

          {/* Exhaust Tip & Flame Spark */}
          <circle cx="48" cy="94" r="5" fill="#475569" />
          <motion.circle
            cx="48"
            cy="94"
            r="4"
            fill="#38bdf8"
            animate={{ opacity: [0.3, 1, 0.2, 0.9, 0.4] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
