"use client";

export function AnimeBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950 select-none"
      aria-hidden="true"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover opacity-75 dark:opacity-45 transition-opacity duration-500"
      >
        <source src="/anime-city.mp4" type="video/mp4" />
      </video>

      {/* Gradient Vignette Overlays for UI Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/90" />
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-background/40 to-background/80" />
    </div>
  );
}
