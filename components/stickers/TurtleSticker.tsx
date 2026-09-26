"use client";

import { motion } from "framer-motion";

export function TurtleSticker({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <defs>
        <radialGradient id="shellGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </radialGradient>
        <pattern id="shellPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="6" fill="#16a34a" opacity="0.25" />
        </pattern>
      </defs>
      {/* legs */}
      <ellipse cx="22" cy="62" rx="8" ry="12" fill="#86efac" transform="rotate(-30 22 62)" />
      <ellipse cx="78" cy="62" rx="8" ry="12" fill="#86efac" transform="rotate(30 78 62)" />
      <ellipse cx="30" cy="84" rx="7" ry="10" fill="#86efac" transform="rotate(-15 30 84)" />
      <ellipse cx="70" cy="84" rx="7" ry="10" fill="#86efac" transform="rotate(15 70 84)" />
      {/* head */}
      <circle cx="50" cy="26" r="16" fill="#86efac" stroke="white" strokeWidth="2.5" />
      <circle cx="44" cy="24" r="2.5" fill="#064e3b" />
      <circle cx="56" cy="24" r="2.5" fill="#064e3b" />
      <path d="M46 32 Q50 35 54 32" fill="none" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" />
      {/* shell */}
      <circle cx="50" cy="58" r="30" fill="url(#shellGrad)" stroke="white" strokeWidth="3" />
      <circle cx="50" cy="58" r="30" fill="url(#shellPattern)" />
      <circle cx="50" cy="58" r="18" fill="none" stroke="#16a34a" strokeWidth="2" opacity="0.4" />
    </motion.svg>
  );
}
