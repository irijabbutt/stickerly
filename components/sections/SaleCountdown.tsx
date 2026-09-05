"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

const HOUR_IN_MS = 60 * 60 * 1000;

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function getTimeLeft(deadline: number): number {
  return Math.max(0, deadline - Date.now());
}

export function SaleCountdown() {
  const t = useTranslations("hero");
  const [deadline] = useState(() => Date.now() + HOUR_IN_MS);
  const [timeLeft, setTimeLeft] = useState<number>(HOUR_IN_MS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(deadline));

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Timer className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-primary">{t("flashSale")}</span>
        <div className="flex items-center gap-2">
          <TimeBox value="01" label={t("hours")} />
          <span className="text-lg font-bold text-primary">:</span>
          <TimeBox value="00" label={t("minutes")} />
          <span className="text-lg font-bold text-primary">:</span>
          <TimeBox value="00" label={t("seconds")} />
        </div>
      </div>
    );
  }

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="inline-flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3"
    >
      <Timer className="h-5 w-5 text-primary" />
      <span className="text-sm font-medium text-primary">{t("flashSale")}</span>
      <div className="flex items-center gap-2">
        <TimeBox value={pad(hours)} label={t("hours")} />
        <span className="text-lg font-bold text-primary">:</span>
        <TimeBox value={pad(minutes)} label={t("minutes")} />
        <span className="text-lg font-bold text-primary">:</span>
        <TimeBox value={pad(seconds)} label={t("seconds")} />
      </div>
    </motion.div>
  );
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="min-w-[2ch] text-center text-2xl font-bold tabular-nums text-primary">
        {value}
      </span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-primary/70">
        {label}
      </span>
    </div>
  );
}
