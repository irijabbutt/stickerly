"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function Blob({
  color,
  size,
  xFactor,
  yFactor,
  initialX,
  initialY,
}: {
  color: string;
  size: number;
  xFactor: number;
  yFactor: number;
  initialX: string;
  initialY: string;
}) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 30, stiffness: 60 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const x = useTransform(sx, (v) => (v - 0.5) * xFactor);
  const y = useTransform(sy, (v) => (v - 0.5) * yFactor);

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${color}`}
      style={{
        width: size,
        height: size,
        left: initialX,
        top: initialY,
        x,
        y,
      }}
    />
  );
}

export function InteractiveBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-background" />
      <Blob
        color="bg-primary"
        size={480}
        xFactor={120}
        yFactor={80}
        initialX="-10%"
        initialY="10%"
      />
      <Blob
        color="bg-accent"
        size={400}
        xFactor={-100}
        yFactor={120}
        initialX="60%"
        initialY="-10%"
      />
      <Blob
        color="bg-cyan-400"
        size={360}
        xFactor={80}
        yFactor={-90}
        initialX="70%"
        initialY="60%"
      />
      <Blob
        color="bg-yellow-300"
        size={280}
        xFactor={-70}
        yFactor={-60}
        initialX="20%"
        initialY="70%"
      />
    </div>
  );
}
