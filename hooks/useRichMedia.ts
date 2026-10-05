"use client";

import { useEffect, useState } from "react";

type NetInfo = { saveData?: boolean; effectiveType?: string };

/**
 * True only when it is appropriate to load heavy media (video / big effects):
 * wide viewport, no reduced-motion preference, no data-saver, not on 2G/3G.
 * Starts false so SSR + first paint use the light fallback (better LCP).
 */
export function useRichMedia(minWidth = 1024): boolean {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const conn = (navigator as Navigator & { connection?: NetInfo }).connection;

    const evaluate = () => {
      const slow =
        !!conn?.saveData || ["slow-2g", "2g", "3g"].includes(conn?.effectiveType ?? "");
      setOk(wide.matches && !calm.matches && !slow);
    };

    evaluate();
    wide.addEventListener("change", evaluate);
    calm.addEventListener("change", evaluate);
    return () => {
      wide.removeEventListener("change", evaluate);
      calm.removeEventListener("change", evaluate);
    };
  }, [minWidth]);

  return ok;
}
