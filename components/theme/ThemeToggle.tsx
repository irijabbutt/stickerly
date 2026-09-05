"use client";

import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, toggle } = useTheme();
  const t = useTranslations("nav");

  return (
    <button
      onClick={toggle}
      className="rounded-full p-2 hover:bg-muted transition"
      aria-label={
        resolvedTheme === "dark" ? t("themeLight") : t("themeDark")
      }
      title={resolvedTheme === "dark" ? t("themeLight") : t("themeDark")}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
