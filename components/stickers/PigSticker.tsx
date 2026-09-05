"use client";

import { motion } from "framer-motion";

export function PigSticker({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      whileHover={{ scale: 1.1, rotate: [0, -8, 8, 0] }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <defs>
        <linearGradient id="pigBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      {/* ears */}
      <ellipse cx="28" cy="32" rx="10" ry="14" fill="#f472b6" transform="rotate(-25 28 32)" />
      <ellipse cx="72" cy="32" rx="10" ry="14" fill="#f472b6" transform="rotate(25 72 32)" />
      {/* body */}
      <circle cx="50" cy="56" r="34" fill="url(#pigBody)" stroke="white" strokeWidth="3" />
      {/* snout */}
      <ellipse cx="50" cy="62" rx="14" ry="10" fill="#f9a8d4" stroke="white" strokeWidth="2" />
      <circle cx="45" cy="62" r="2.5" fill="#831843" />
      <circle cx="55" cy="62" r="2.5" fill="#831843" />
      {/* eyes */}
      <circle cx="38" cy="48" r="4" fill="#831843" />
      <circle cx="40" cy="46" r="1.5" fill="white" />
      <circle cx="62" cy="48" r="4" fill="#831843" />
      <circle cx="64" cy="46" r="1.5" fill="white" />
      {/* blush */}
      <circle cx="30" cy="58" r="4" fill="#f472b6" opacity="0.5" />
      <circle cx="70" cy="58" r="4" fill="#f472b6" opacity="0.5" />
      {/* legs */}
      <ellipse cx="36" cy="86" rx="5" ry="7" fill="#f472b6" />
      <ellipse cx="64" cy="86" rx="5" ry="7" fill="#f472b6" />
      {/* tail */}
      <path
        d="M80 60 Q88 58 86 66 Q84 72 90 70"
        fill="none"
        stroke="#f472b6"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
