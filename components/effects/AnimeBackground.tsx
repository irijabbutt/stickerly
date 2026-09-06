"use client";

export function AnimeBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950 select-none"
      aria-hidden="true"
    >
      {/* Background Video - scaled up slightly to clip hardcoded black pillarboxes */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover scale-[1.08] opacity-90 dark:opacity-75 transition-opacity duration-500"
      >
        <source src="/anime-city.mp4" type="video/mp4" />
      </video>

      {/* Backdrop Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/20" />
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-background/10 to-background/20" />
    </div>
  );
}
