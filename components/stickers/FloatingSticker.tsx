"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FloatingSticker({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{
        opacity: 1,
        y: [0, -14, 0],
        rotate: [-4, 4, -4],
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: { duration: 3 + Math.random() * 1.5, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      {children}
    </motion.div>
  );
}
