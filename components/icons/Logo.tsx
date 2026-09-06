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
        {/* Rainbow under-peel gradient transitioning to vibrant blue */}
        <linearGradient id="stickerlyPeelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="30%" stopColor="#ec4899" />
          <stop offset="60%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>

        {/* Pastel rainbow star gradient */}
        <linearGradient id="stickerlyStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="75%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Drop shadow for paper peel fold */}
        <filter id="peelFoldShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-1" dy="1.5" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.28" />
        </filter>

        {/* Mask: Erases 'i' dot & clips bottom-left corner of 'S' */}
        <mask id="logoCombinedMask">
          <rect x="0" y="0" width="100%" height="100%" fill="#ffffff" />
          <circle cx="76" cy="20" r="14" fill="#000000" />
          <path d="M -10 48 L 22 72 L -10 85 Z" fill="#000000" />
        </mask>
      </defs>

      {/* Main Brand Wordmark */}
      <text
        x="0"
        y="70"
        fontFamily="ui-rounded, 'Comfortaa', 'Fredoka', 'Quicksand', 'Nunito', system-ui, -apple-system, sans-serif"
        fontSize="68"
        fontWeight="800"
        mask="url(#logoCombinedMask)"
        className="fill-[#121324] dark:fill-white"
        style={{ letterSpacing: "-0.03em" }}
      >
        Stickerly
      </text>

      {/* Under-Peel Gradient Reveal (Ends in vibrant blue) */}
      <path
        d="M 1 50 C 1 62, 8 71, 20 71 L 1 50 Z"
        fill="url(#stickerlyPeelGrad)"
      />

      {/* White Rolled Paper Curl */}
      <path
        d="M 1 50 C 7 42, 16 54, 20 71 C 12 58, 5 54, 1 50 Z"
        fill="#ffffff"
        filter="url(#peelFoldShadow)"
      />

      {/* Rainbow Star Sticker */}
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
