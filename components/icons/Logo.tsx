"use client";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "h-10 w-auto", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 90"
      fill="none"
      role="img"
      aria-label="Stickerly"
      className={className}
      {...props}
    >
      <defs>
        {/* Rainbow under-peel gradient */}
        <linearGradient id="stickerlyPeelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="45%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Pastel rainbow star gradient */}
        <linearGradient id="stickerlyStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="75%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Soft realistic drop shadow under the paper fold */}
        <filter id="peelFoldShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-0.8" dy="1.2" stdDeviation="1" floodColor="#000000" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* Main Brand Wordmark */}
      <text
        x="0"
        y="68"
        fontFamily="ui-rounded, 'Comfortaa', 'Fredoka', 'Quicksand', 'Nunito', system-ui, -apple-system, sans-serif"
        fontSize="64"
        fontWeight="800"
        className="fill-slate-900 dark:fill-white"
        style={{ letterSpacing: "-0.025em" }}
      >
        Stickerly
      </text>

      {/* Corner Peel Fold - Re-anchored seamlessly to the bottom-left tail of 'S' */}
      <g transform="translate(0, 45)">
        {/* Underlayer Gradient Reveal */}
        <path
          d="M 1.5 23 C 1.5 13, 7 7, 19 23 C 13 25, 5 25, 1.5 23 Z"
          fill="url(#stickerlyPeelGrad)"
        />
        {/* Curved White Rolled Paper Fold */}
        <path
          d="M 1.5 23 C 6.5 17, 13.5 15, 19 23 C 12.5 15.5, 6.5 16.5, 1.5 23 Z"
          fill="#ffffff"
          filter="url(#peelFoldShadow)"
        />
      </g>

      {/* Pastel Star Sticker placed over the 'i' dot */}
      <g transform="translate(73, 5)">
        <path
          d="M 11 1 L 13.8 6.8 L 20 7.7 L 15.5 12.1 L 16.5 18.2 L 11 15.3 L 5.5 18.2 L 6.5 12.1 L 2 7.7 L 8.2 6.8 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M 11 1 L 13.8 6.8 L 20 7.7 L 15.5 12.1 L 16.5 18.2 L 11 15.3 L 5.5 18.2 L 6.5 12.1 L 2 7.7 L 8.2 6.8 Z"
          fill="url(#stickerlyStarGrad)"
        />
      </g>
    </svg>
  );
}
