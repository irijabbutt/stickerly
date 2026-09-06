"use client";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "h-10 w-auto", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 340 95"
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

        {/* Soft drop shadow under the white peel fold */}
        <filter id="peelFoldShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-1" dy="1.5" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Main Brand Wordmark */}
      <text
        x="0"
        y="70"
        fontFamily="ui-rounded, 'Comfortaa', 'Fredoka', 'Quicksand', 'Nunito', system-ui, -apple-system, sans-serif"
        fontSize="68"
        fontWeight="800"
        className="fill-slate-900 dark:fill-white"
        style={{ letterSpacing: "-0.03em" }}
      >
        Stickerly
      </text>

      {/* Corner Peel Fold on bottom-left of 'S' */}
      <g transform="translate(0, 48)">
        <path
          d="M 2 22 C 2 12, 8 6, 20 22 C 14 24, 6 24, 2 22 Z"
          fill="url(#stickerlyPeelGrad)"
        />
        <path
          d="M 2 22 C 8 16, 15 14, 20 21 C 13 15, 7 16, 2 22 Z"
          fill="#ffffff"
          filter="url(#peelFoldShadow)"
        />
      </g>

      {/* Pastel Star Sticker placed directly above the 't' stem */}
      <g transform="translate(65, 2)">
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
