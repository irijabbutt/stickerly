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
        {/* Vibrant under-peel rainbow gradient */}
        <linearGradient id="stickerlyPeelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="35%" stopColor="#f43f5e" />
          <stop offset="70%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Pastel rainbow star gradient */}
        <linearGradient id="stickerlyStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="25%" stopColor="#a3e635" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="75%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>

        {/* Realistic drop shadow for rolled paper peel */}
        <filter id="peelFoldShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-1.5" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.32" />
        </filter>
      </defs>

      {/* Main Brand Wordmark */}
      <text
        x="0"
        y="72"
        fontFamily="ui-rounded, 'Comfortaa', 'Fredoka', 'Quicksand', 'Nunito', system-ui, -apple-system, sans-serif"
        fontSize="72"
        fontWeight="800"
        className="fill-slate-900 dark:fill-white"
        style={{ letterSpacing: "-0.035em" }}
      >
        Stickerly
      </text>

      {/* Large Corner Peel Fold on bottom-left curve of 'S' */}
      <g transform="translate(-1, 40)">
        {/* Exposed Underlayer Gradient */}
        <path
          d="M 3 34 C 3 18, 10 10, 28 32 C 18 36, 8 36, 3 34 Z"
          fill="url(#stickerlyPeelGrad)"
        />
        {/* Curled White Paper Backing */}
        <path
          d="M 3 34 C 10 23, 20 21, 28 32 C 18 19, 8 21, 3 34 Z"
          fill="#ffffff"
          filter="url(#peelFoldShadow)"
        />
      </g>

      {/* Die-Cut Star Sticker positioned above 't' stem */}
      <g transform="translate(98, 2)">
        <path
          d="M 12 1 L 15.2 7.8 L 22.4 8.8 L 17.2 13.9 L 18.4 21.1 L 12 17.7 L 5.6 21.1 L 6.8 13.9 L 1.6 8.8 L 8.8 7.8 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M 12 1 L 13.8 6.8 L 20 7.7 L 15.5 12.1 L 16.5 18.2 L 11 15.3 L 5.5 18.2 L 6.5 12.1 L 2 7.7 L 8.2 6.8 Z"
          fill="url(#stickerlyStarGrad)"
        />
      </g>
    </svg>
  );
}
