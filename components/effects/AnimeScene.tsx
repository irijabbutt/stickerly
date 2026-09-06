"use client";

import { motion } from "framer-motion";

function seeded(index: number, max: number) {
  const x = Math.sin(index * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * max;
}

// Korean Hangul Neon Sign with Neon Glow
function KoreanSign({
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
  color: "orange" | "cyan" | "pink" | "yellow";
  vertical?: boolean;
  delay?: number;
}) {
  const colorStyles = {
    orange: "text-orange-400 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.7)]",
    cyan: "text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.7)]",
    pink: "text-pink-400 border-pink-500 shadow-[0_0_15px_rgba(244,114,182,0.7)]",
    yellow: "text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.7)]",
  };

  return (
    <motion.div
      className={`absolute rounded-xs border px-1.5 py-0.5 text-xs font-black tracking-widest backdrop-blur-xs select-none ${
        colorStyles[color]
      } ${vertical ? "flex flex-col items-center leading-none gap-1" : ""}`}
      style={{ top, left }}
      animate={{ opacity: [0.8, 1, 0.4, 1, 0.85, 0.2, 1] }}
      transition={{
        duration: 3.5 + delay,
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

// Moving Traffic Cars (Driving in both directions)
function MovingCar({
  bottom,
  duration,
  delay,
  direction,
  scale = 1,
  color = "#22d3ee",
}: {
  bottom: string;
  duration: number;
  delay: number;
  direction: "left" | "right";
  scale?: number;
  color?: string;
}) {
  const isLeft = direction === "left";

  return (
    <motion.div
      className="absolute flex items-end"
      style={{ bottom }}
      initial={{ x: isLeft ? "110vw" : "-20vw", scale }}
      animate={{ x: isLeft ? "-30vw" : "110vw" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="relative h-6 w-16 rounded-t-md bg-slate-900 border-t border-slate-700 shadow-md">
        {/* Roof line */}
        <div className="absolute -top-3 left-3 h-3 w-9 rounded-t-md bg-slate-800" />
        {/* Headlight / Taillight Glow */}
        <div
          className={`absolute bottom-1 h-1.5 w-2 rounded-full ${
            isLeft
              ? "left-0 bg-cyan-300 shadow-[0_0_10px_#22d3ee]"
              : "right-0 bg-rose-500 shadow-[0_0_10px_#f43f5e]"
          }`}
        />
        <div
          className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
            isLeft
              ? "right-0 bg-rose-500 shadow-[0_0_8px_#f43f5e]"
              : "left-0 bg-cyan-300 shadow-[0_0_8px_#22d3ee]"
          }`}
        />
        {/* Underglow Reflection */}
        <div
          className="absolute -bottom-1 left-2 h-1 w-12 rounded-full blur-xs"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}

// Animated Walking Pedestrians
function WalkingPerson({
  bottom,
  duration,
  delay,
  direction,
  scale = 0.8,
}: {
  bottom: string;
  duration: number;
  delay: number;
  direction: "left" | "right";
  scale?: number;
}) {
  const isLeft = direction === "left";

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ bottom }}
      initial={{ x: isLeft ? "105vw" : "-10vw" }}
      animate={{ x: isLeft ? "-10vw" : "105vw" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <motion.div
        className="flex flex-col items-center"
        style={{ scale }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Head */}
        <div className="h-2.5 w-2.5 rounded-full bg-slate-950" />
        {/* Torso */}
        <div className="h-5 w-3 rounded-xs bg-slate-900 border-t border-orange-400/40" />
        {/* Legs (Animated walking motion) */}
        <div className="flex gap-1">
          <motion.div
            className="h-4 w-1 bg-slate-950 origin-top"
            animate={{ rotate: [-20, 20, -20] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="h-4 w-1 bg-slate-950 origin-top"
            animate={{ rotate: [20, -20, 20] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AnimeScene() {
  // Drifting Golden Sunset Clouds
  const clouds = Array.from({ length: 5 }, (_, i) => ({
    top: `${5 + seeded(i, 20)}%`,
    scale: 0.8 + seeded(i + 10, 0.6),
    duration: 30 + seeded(i + 20, 20),
    delay: seeded(i + 30, 10),
  }));

  // Background Pedestrians on Sidewalks
  const pedestrians = Array.from({ length: 8 }, (_, i) => ({
    bottom: `${22 + seeded(i + 50, 4)}%`,
    duration: 18 + seeded(i + 60, 12),
    delay: seeded(i + 70, 10),
    direction: (i % 2 === 0 ? "left" : "right") as "left" | "right",
    scale: 0.7 + seeded(i + 80, 0.2),
  }));

  // Traffic Driving Down Alley
  const traffic = Array.from({ length: 6 }, (_, i) => ({
    bottom: `${12 + seeded(i + 100, 8)}%`,
    duration: 8 + seeded(i + 110, 6),
    delay: seeded(i + 120, 8),
    direction: (i % 2 === 0 ? "right" : "left") as "left" | "right",
    scale: 0.75 + seeded(i + 130, 0.25),
    color: i % 2 === 0 ? "#22d3ee" : "#f43f5e",
  }));

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-b from-amber-500 via-orange-600 via-rose-700 to-slate-950 select-none">
      {/* 1. Golden Hour Sunset Glow */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/40 via-orange-500/20 to-transparent blur-2xl" />

      {/* 2. Drifting Sunset Clouds */}
      {clouds.map((c, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute rounded-full bg-amber-200/40 blur-md"
          style={{
            top: c.top,
            width: 140 * c.scale,
            height: 45 * c.scale,
          }}
          initial={{ x: "-30vw" }}
          animate={{ x: "120vw" }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* 3. Overhead Power Lines (Classic Asian Street Aesthetic) */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-40">
        <path d="M 0 40 Q 200 90, 400 30 T 800 60" fill="none" stroke="#1e1b4b" strokeWidth="1.5" />
        <path d="M 0 55 Q 300 110, 600 40 T 1000 80" fill="none" stroke="#1e1b4b" strokeWidth="1" />
        <path d="M 0 70 Q 150 120, 500 50 T 900 90" fill="none" stroke="#1e1b4b" strokeWidth="1.2" />
      </svg>

      {/* 4. Background Alley Buildings Silhouette (Teal / Slate) */}
      <svg
        className="absolute bottom-0 left-0 w-full text-slate-900/90"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,500 L0,120 L80,120 L80,180 L140,180 L140,500 L220,500 L220,100 L310,100 L310,500 L680,500 L680,90 L780,90 L780,160 L860,160 L860,500 L1000,500 Z"
        />
      </svg>

      {/* Midground Layer (Korean Stores & Perspective) */}
      <svg
        className="absolute bottom-0 left-0 w-full text-slate-950"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,500 L0,200 L120,200 L120,150 L200,150 L200,500 L350,500 L350,380 L650,380 L650,500 L800,500 L800,170 L920,170 L920,240 L1000,240 L1000,500 Z"
        />
      </svg>

      {/* 5. Authentic Korean Hangul Neon Storefront Signs */}
      <KoreanSign text="강남포차" top="32%" left="12%" color="orange" vertical delay={0.2} />
      <KoreanSign text="편의점 GS25" top="28%" left="24%" color="cyan" delay={0.6} />
      <KoreanSign text="카페" top="42%" left="72%" color="pink" delay={1.1} />
      <KoreanSign text="서울" top="22%" left="82%" color="yellow" vertical delay={0.4} />

      {/* 6. Sidewalk & Moving Pedestrians */}
      {pedestrians.map((p, i) => (
        <WalkingPerson key={`person-${i}`} {...p} />
      ))}

      {/* 7. Wet Asphalt Road Base & Neon Reflection Glows */}
      <div className="absolute bottom-0 inset-x-0 h-[26%] bg-gradient-to-t from-slate-950 via-indigo-950/90 to-slate-900 border-t border-orange-500/30">
        {/* Wet Floor Neon Reflections */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/25 via-cyan-500/15 to-transparent blur-md" />
        {/* Lane lines */}
        <div className="absolute top-1/2 inset-x-0 h-0.5 border-b border-dashed border-amber-400/30" />
      </div>

      {/* 8. Moving Traffic Cars in Background */}
      {traffic.map((t, i) => (
        <MovingCar key={`traffic-${i}`} {...t} />
      ))}

      {/* 9. Hero Japanese / Korean Tuner Car in Foreground */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center select-none"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Tuner Car SVG Model (Widebody Sports Sedan) */}
        <svg width="260" height="90" viewBox="0 0 260 90" fill="none">
          {/* Underglow Light */}
          <ellipse cx="130" cy="82" rx="100" ry="6" fill="#22d3ee" opacity="0.8" className="blur-xs" />

          {/* Car Body Shadow */}
          <rect x="20" y="70" width="220" height="12" rx="6" fill="#020617" opacity="0.9" />

          {/* Rear Bumper & Widebody Fenders */}
          <path d="M 15 72 L 35 48 L 225 48 L 245 72 L 235 80 L 25 80 Z" fill="#0f172a" />
          <path d="M 25 72 L 40 50 L 220 50 L 235 72 L 225 78 L 35 78 Z" fill="#1e293b" />

          {/* Rear Windshield & Pillars */}
          <path d="M 55 48 L 75 22 L 185 22 L 205 48 Z" fill="#020617" />
          <path d="M 62 46 L 78 26 L 182 26 L 198 46 Z" fill="#38bdf8" opacity="0.25" />

          {/* GT Wing Spoiler */}
          <rect x="40" y="16" width="180" height="4" rx="2" fill="#0f172a" />
          <rect x="65" y="20" width="6" height="8" fill="#020617" />
          <rect x="189" y="20" width="6" height="8" fill="#020617" />

          {/* Tail Lights (Iconic Quad Round Skylike Lights) */}
          <circle cx="55" cy="60" r="7" fill="#ef4444" className="shadow-[0_0_12px_#ef4444]" />
          <circle cx="75" cy="60" r="7" fill="#ef4444" className="shadow-[0_0_12px_#ef4444]" />
          <circle cx="185" cy="60" r="7" fill="#ef4444" className="shadow-[0_0_12px_#ef4444]" />
          <circle cx="205" cy="60" r="7" fill="#ef4444" className="shadow-[0_0_12px_#ef4444]" />

          {/* License Plate */}
          <rect x="110" y="58" width="40" height="14" rx="2" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
          <text x="130" y="68" fontSize="8" fontWeight="bold" fill="#0f172a" textAnchor="middle">
            서울 330
          </text>

          {/* Exhaust Pipes with Flame Animation */}
          <circle cx="42" cy="76" r="4" fill="#64748b" />
          <motion.circle
            cx="42"
            cy="76"
            r="3"
            fill="#38bdf8"
            animate={{ opacity: [0.2, 0.9, 0.1, 0.8, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
