"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const t = useTranslations("faq");
  const [open, setOpen] = useState<string | null>("q1");

  const questions = ["q1", "q2", "q3", "q4"];

  return (
    <section id="faq" className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>
        <div className="mt-12 space-y-4">
          {questions.map((key) => (
            <div
              key={key}
              className="rounded-2xl border border-border bg-background overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === key ? null : key)}
                className="flex w-full items-center justify-between px-6 py-4 text-start font-medium"
              >
                {t(key)}
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    open === key ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {t(`a${key.slice(1)}`)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
