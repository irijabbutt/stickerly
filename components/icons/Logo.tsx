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
        {/* Rainbow peel gradient */}
        <linearGradient id="logoPeelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="50%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Rainbow star gradient */}
        <linearGradient id="logoStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="25%" stopColor="#fb923c" />
          <stop offset="55%" stopColor="#f472b6" />
          <stop offset="80%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Drop shadow under the peeled fold */}
        <filter id="peelShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Wordmark - Adapts automatically in Dark Mode */}
      <text
        x="0"
        y="68"
        fontFamily="ui-rounded, 'Comfortaa', 'Nunito', system-ui, -apple-system, sans-serif"
        fontSize="64"
        fontWeight="900"
        className="fill-slate-900 dark:fill-white"
        style={{ letterSpacing: "-0.03em" }}
      >
        Stickerly
      </text>

      {/* Corner peel fold on bottom-left of 'S' */}
      <g transform="translate(0, 46)">
        <path
          d="M 2 22 C 2 12, 8 6, 18 22 C 12 24, 5 24, 2 22 Z"
          fill="url(#logoPeelGradient)"
        />
        <path
          d="M 2 22 C 8 18, 14 16, 18 22 C 12 16, 6 17, 2 22 Z"
          fill="#ffffff"
          filter="url(#peelShadow)"
        />
      </g>

      {/* Rainbow Star Sticker - Placed precisely over the 'i' dot */}
      <g transform="translate(71, 6)">
        <path
          d="M 10 1 L 12.8 6.8 L 19 7.7 L 14.5 12.1 L 15.5 18.2 L 10 15.3 L 4.5 18.2 L 5.5 12.1 L 1 7.7 L 7.2 6.8 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M 10 1 L 12.8 6.8 L 19 7.7 L 14.5 12.1 L 15.5 18.2 L 10 15.3 L 4.5 18.2 L 5.5 12.1 L 1 7.7 L 7.2 6.8 Z"
          fill="url(#logoStarGradient)"
        />
      </g>
    </svg>
  );
}
