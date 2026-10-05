"use client";

import { useRichMedia } from "@/hooks/useRichMedia";

export function AnimeBackground() {
  const showVideo = useRichMedia(1024);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none mesh-bg"
      aria-hidden="true"
    >
      {/* 11 MB video only on wide, capable, motion-OK connections */}
      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="metadata"
          className="h-full w-full scale-[1.35] object-cover opacity-90 transition-opacity duration-500 dark:opacity-75"
        >
          <source src="/anime-city.mp4" type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/20" />
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-background/10 to-background/20" />
    </div>
  );
}
