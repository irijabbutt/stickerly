"use client";

import { motion } from "framer-motion";

export function BlobSticker({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      whileHover={{ scale: 1.1, rotate: [0, -12, 12, 0] }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <defs>
        <linearGradient id="blobBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      {/* blob body */}
      <path
        d="M30 70 C10 60, 10 30, 35 22 C45 18, 55 18, 65 22 C90 30, 95 60, 70 72 C60 78, 40 78, 30 70 Z"
        fill="url(#blobBody)"
        stroke="white"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* horn */}
      <path d="M40 24 L36 10 L44 22" fill="#facc15" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      <path d="M60 24 L64 10 L56 22" fill="#facc15" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      {/* eye */}
      <circle cx="45" cy="44" r="6" fill="white" />
      <circle cx="47" cy="44" r="3" fill="#0f172a" />
      <circle cx="48" cy="42" r="1" fill="white" />
      {/* mouth */}
      <path d="M38 58 Q50 66 62 58" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* spots */}
      <circle cx="72" cy="48" r="3" fill="#f472b6" opacity="0.8" />
      <circle cx="24" cy="52" r="2.5" fill="#facc15" opacity="0.8" />
    </motion.svg>
  );
}
