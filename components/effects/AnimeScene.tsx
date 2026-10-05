"use client";

import { useRichMedia } from "@/hooks/useRichMedia";

interface AnimeSceneProps {
  className?: string;
}

export function AnimeScene({ className = "" }: AnimeSceneProps) {
  const showVideo = useRichMedia(1024);

  return (
    <div
      className={`mesh-bg relative h-full w-full overflow-hidden rounded-3xl shadow-2xl ${className}`}
    >
      {/* Light CSS motion: always on, transform-only, off with reduced-motion */}
      <div className="animate-float absolute left-[12%] top-[18%] h-24 w-24 rounded-3xl bg-gradient-to-br from-violet-400 to-fuchsia-400 opacity-80 blur-[1px] sm:h-32 sm:w-32" />
      <div className="animate-float absolute bottom-[14%] right-[14%] h-20 w-20 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 opacity-80 [animation-delay:-2s] sm:h-28 sm:w-28" />
      <div className="animate-float absolute right-[38%] top-[8%] h-12 w-12 rounded-full bg-gradient-to-br from-emerald-300 to-cyan-300 opacity-80 [animation-delay:-4s]" />

      {showVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          preload="metadata"
          className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-center"
        >
          <source src="/anime-city.mp4" type="video/mp4" />
        </video>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {showVideo && (
        <div className="absolute end-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
          LIVE SCENE
        </div>
      )}
    </div>
  );
}
