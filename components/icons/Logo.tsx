"use client";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 80"
      fill="none"
      role="img"
      aria-label="Stickerly"
      className={className}
    >
      <defs>
        <linearGradient id="logoPeelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="35%" stopColor="#ec4899" />
          <stop offset="75%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="logoStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="25%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="75%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>

      <path
        d="M22 56 C18 56, 14 53, 13 49 C12 45, 15 42, 18 42 C22 42, 26 45, 26 50 C27 54, 24 56, 22 56 Z"
        fill="url(#logoPeelGradient)"
      />
      <path
        d="M22 56 C20 58, 16 58, 14 55 C12 53, 12 49, 14 47"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />

      <text
        x="36"
        y="62"
        fontFamily="ui-rounded, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="60"
        fontWeight="800"
        fill="currentColor"
        style={{ letterSpacing: "-0.02em" }}
      >
        Stickerly
      </text>

      <path
        d="M102 16 L105 24 L113 24 L107 29 L109 37 L102 32 L95 37 L97 29 L91 24 L99 24 Z"
        fill="url(#logoStarGradient)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
