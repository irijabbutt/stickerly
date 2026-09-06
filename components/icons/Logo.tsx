"use client";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "h-10 w-auto", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 330 95"
      fill="none"
      role="img"
      aria-label="Stickerly"
      className={className}
      {...props}
    >
      <defs>
        {/* Vibrant rainbow under-peel gradient */}
        <linearGradient id="stickerlyPeelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="30%" stopColor="#f43f5e" />
          <stop offset="65%" stopColor="#d946ef" />
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
          <feDropShadow dx="-1.5" dy="2" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.32" />
        </filter>

        {/* Combined Mask: Erases the native 'i' dot and cleanly clips the bottom-left half of 'S' */}
        <mask id="logoCombinedMask">
          <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
          {/* Erase native font 'i' dot */}
          <circle cx="76" cy="20" r="14" fill="#000000" />
          {/* Diagonal cut line masking the bottom-left quadrant of 'S' */}
          <path d="M -10 46 L 34 82 L -10 95 Z" fill="#000000" />
        </mask>
      </defs>

      {/* Main Brand Wordmark (Masked to cleanly cut text along the fold) */}
      <text
        x="0"
        y="70"
        fontFamily="ui-rounded, 'Comfortaa', 'Fredoka', 'Quicksand', 'Nunito', system-ui, -apple-system, sans-serif"
        fontSize="68"
        fontWeight="800"
        mask="url(#logoCombinedMask)"
        className="fill-slate-900 dark:fill-white"
        style={{ letterSpacing: "-0.03em" }}
      >
        Stickerly
      </text>

      {/* Enlarged Under-Peel Rainbow Reveal (Replaces masked bottom-left of 'S') */}
      <path
        d="M 1 48 C 1 68, 8 82, 32 80 L 1 48 Z"
        fill="url(#stickerlyPeelGrad)"
      />

      {/* Enlarged White Paper Curl (Flips cleanly over the fold line with drop shadow) */}
      <path
        d="M 1 48 C 10 36, 26 54, 32 80 C 20 62, 8 54, 1 48 Z"
        fill="#ffffff"
        filter="url(#peelFoldShadow)"
      />

      {/* Star Sticker (Centered directly over the erased 'i' dot) */}
      <g transform="translate(63, 7) scale(1.2)">
        <path
          d="M 11 1 L 13.8 6.8 L 20 7.7 L 15.5 12.1 L 16.5 18.2 L 11 15.3 L 5.5 18.2 L 6.5 12.1 L 2 7.7 L 8.2 6.8 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="4"
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
