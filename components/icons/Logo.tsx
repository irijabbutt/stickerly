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
        {/* Peel reveal rainbow gradient */}
        <linearGradient id="stickerlyPeelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Star sticker gradient */}
        <linearGradient id="stickerlyStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="25%" stopColor="#fb923c" />
          <stop offset="55%" stopColor="#f472b6" />
          <stop offset="80%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Soft shadow for the peel fold */}
        <filter id="peelFoldShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main Brand Text - dynamically handles light & dark mode */}
      <g className="fill-slate-900 dark:fill-white">
        <text
          x="0"
          y="72"
          fontFamily="ui-rounded, 'Comfortaa', 'Nunito', system-ui, -apple-system, sans-serif"
          fontSize="70"
          fontWeight="900"
          textLength="330"
          lengthAdjust="spacingAndGlyphs"
        >
          Stickerly
        </text>
      </g>

      {/* Smooth Bottom-Left Peel on 'S' */}
      <g transform="translate(0, 42)">
        {/* Under-layer (revealed gradient) */}
        <path
          d="M 2 30 C 2 20, 10 12, 24 28 C 14 30, 5 30, 2 30 Z"
          fill="url(#stickerlyPeelGradient)"
        />
        {/* Folded white backside */}
        <path
          d="M 2 30 C 10 25, 18 22, 24 28 C 16 18, 8 20, 2 30 Z"
          fill="#ffffff"
          filter="url(#peelFoldShadow)"
        />
      </g>

      {/* Star Badge placed directly over the letter 'i' */}
      <g transform="translate(108, 4)">
        {/* White Die-Cut Border */}
        <path
          d="M 11 1 L 13.8 6.8 L 20 7.7 L 15.5 12.1 L 16.5 18.2 L 11 15.3 L 5.5 18.2 L 6.5 12.1 L 2 7.7 L 8.2 6.8 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Gradient Star */}
        <path
          d="M 11 1 L 13.8 6.8 L 20 7.7 L 15.5 12.1 L 16.5 18.2 L 11 15.3 L 5.5 18.2 L 6.5 12.1 L 2 7.7 L 8.2 6.8 Z"
          fill="url(#stickerlyStarGradient)"
        />
      </g>
    </svg>
  );
}
