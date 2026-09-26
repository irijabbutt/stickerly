"use client";

import { usePathname } from "next/navigation";
import { SaleCountdown } from "./SaleCountdown";

export function SaleCountdownWrapper() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.includes("/admin/")) {
    return null;
  }

  return (
    <div className="relative z-20 flex justify-center bg-background/70 px-4 py-2 backdrop-blur-md dark:bg-background/50">
      <SaleCountdown />
    </div>
  );
}
