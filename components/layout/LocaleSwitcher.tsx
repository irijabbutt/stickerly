"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const locales = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "ur", name: "اردو" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export function LocaleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newLocale: string) => {
    setIsOpen(false);
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath || `/${newLocale}`);
  };

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left z-50">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors focus:outline-none"
      >
        <span>{currentLocale.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-36 rounded-2xl border border-border bg-background py-2 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleSelect(loc.code)}
              className={`block min-h-11 w-full px-4 py-2 text-start text-sm transition-colors hover:bg-muted ${
                locale === loc.code ? "font-semibold text-primary" : "text-foreground"
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
