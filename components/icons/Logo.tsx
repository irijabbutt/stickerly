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
        {/* Rainbow gradient for peeled corner back */}
        <linearGradient id="stickerlyPeelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="35%" stopColor="#ec4899" />
          <stop offset="70%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Rainbow gradient for the star */}
        <linearGradient id="stickerlyStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="25%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="75%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Soft shadow under the peel fold */}
        <filter id="peelFoldShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Main Brand Wordmark */}
      <text
        x="2"
        y="68"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Nunito', 'Comfortaa', sans-serif"
        fontSize="64"
        fontWeight="900"
        fill="#121324"
        style={{ letterSpacing: "-0.03em" }}
      >
        Stickerly
      </text>

      {/* Peeled Corner Underlayer (Revealed Backing) */}
      <path
        d="M 4 58 C 4 66, 12 74, 22 74 L 8 74 Z"
        fill="url(#stickerlyPeelGradient)"
      />

      {/* Peeled Corner Fold (White Backing) */}
      <path
        d="M 4 58 C 12 62, 18 68, 22 74 C 15 72, 8 66, 4 58 Z"
        fill="#ffffff"
        filter="url(#peelFoldShadow)"
      />

      {/* Star Sticker Badge over 't' */}
      <g transform="translate(103, 8)">
        {/* White Sticker Border Outline */}
        <path
          d="M 12 2 L 15.2 8.5 L 22.4 9.6 L 17.2 14.7 L 18.4 21.8 L 12 18.5 L 5.6 21.8 L 6.8 14.7 L 1.6 9.6 L 8.8 8.5 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Star Gradient Fill */}
        <path
          d="M 12 2 L 15.2 8.5 L 22.4 9.6 L 17.2 14.7 L 18.4 21.8 L 12 18.5 L 5.6 21.8 L 6.8 14.7 L 1.6 9.6 L 8.8 8.5 Z"
          fill="url(#stickerlyStarGradient)"
        />
      </g>
    </svg>
  );
}
