"use client";

import { useTranslations } from "next-intl";
import { Search, Download } from "lucide-react";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      step: "1",
      icon: Search,
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      step: "2",
      icon: Download,
      title: t("step2Title"),
      description: t("step2Desc"),
    },
  ];

  return (
    <section id="how-it-works" className="cv-auto scroll-mt-20 py-20 bg-background/50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="flex flex-col items-center text-center p-6 rounded-3xl border border-border bg-background/80 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background font-bold text-lg mb-4">
                  {item.step}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
