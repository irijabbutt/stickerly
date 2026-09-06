"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

const HOUR_IN_MS = 60 * 60 * 1000;
const SALE_DEADLINE_KEY = "flash_sale_deadline";

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function getTimeLeft(deadline: number): number {
  return Math.max(0, deadline - Date.now());
}

function getOrCreateDeadline(): number {
  const storedDeadline = localStorage.getItem(SALE_DEADLINE_KEY);

  if (storedDeadline) {
    const deadline = Number(storedDeadline);

    // Continue existing countdown if it hasn't expired
    if (deadline > Date.now()) {
      return deadline;
    }
  }

  // Create a new 1-hour countdown only when no valid countdown exists
  const newDeadline = Date.now() + HOUR_IN_MS;

  localStorage.setItem(
    SALE_DEADLINE_KEY,
    newDeadline.toString()
  );

  return newDeadline;
}

export function SaleCountdown() {
  const t = useTranslations("hero");

  const [deadline, setDeadline] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(HOUR_IN_MS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get existing deadline or create it once
    const savedDeadline = getOrCreateDeadline();

    setDeadline(savedDeadline);
    setTimeLeft(getTimeLeft(savedDeadline));

    const interval = setInterval(() => {
      const remaining = getTimeLeft(savedDeadline);

      setTimeLeft(remaining);

      // Stop updating once countdown reaches zero
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted || deadline === null) {
    return (
      <div className="inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
        <Timer className="h-5 w-5 text-primary" />

        <span className="text-sm font-medium text-primary">
          {t("flashSale")}
        </span>

        <div className="flex items-center gap-2">
          <TimeBox value="01" label={t("hours")} />

          <span className="text-lg font-bold text-primary">
            :
          </span>

          <TimeBox value="00" label={t("minutes")} />

          <span className="text-lg font-bold text-primary">
            :
          </span>

          <TimeBox value="00" label={t("seconds")} />
        </div>
      </div>
    );
  }

  const totalSeconds = Math.floor(timeLeft / 1000);

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="inline-flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3"
    >
      <Timer className="h-5 w-5 text-primary" />

      <span className="text-sm font-medium text-primary">
        {t("flashSale")}
      </span>

      <div className="flex items-center gap-2">
        <TimeBox
          value={pad(hours)}
          label={t("hours")}
        />

        <span className="text-lg font-bold text-primary">
          :
        </span>

        <TimeBox
          value={pad(minutes)}
          label={t("minutes")}
        />

        <span className="text-lg font-bold text-primary">
          :
        </span>

        <TimeBox
          value={pad(seconds)}
          label={t("seconds")}
        />
      </div>
    </motion.div>
  );
}

function TimeBox({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
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
