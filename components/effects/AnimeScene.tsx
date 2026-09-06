"use client";

interface AnimeSceneProps {
  className?: string;
}

export function AnimeScene({ className = "" }: AnimeSceneProps) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-3xl bg-slate-950 shadow-2xl ${className}`}
    >
      {/* Background Video scaled up slightly to clip embedded black borders */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center scale-[1.08]"
      >
        <source src="/anime-city.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Subtle Depth Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Live Badge */}
      <div className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
        LIVE SCENE
      </div>
    </div>
  );
}
