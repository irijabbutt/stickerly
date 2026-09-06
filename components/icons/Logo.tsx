"use client";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "h-10 w-auto", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 330 90"
      fill="none"
      role="img"
      aria-label="Stickerly"
      className={className}
      {...props}
    >
      <defs>
        {/* Rainbow under-peel gradient */}
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

        {/* Soft drop shadow for paper peel fold */}
        <filter id="peelFoldShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-1" dy="1.5" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Wordmark Text */}
      <text
        x="0"
        y="68"
        fontFamily="ui-rounded, 'Comfortaa', 'Nunito', system-ui, -apple-system, sans-serif"
        fontSize="66"
        fontWeight="900"
        className="fill-slate-900 dark:fill-white"
        style={{ letterSpacing: "-0.035em" }}
      >
        Stickerly
      </text>

      {/* Corner Peel Fold on bottom-left of 'S' */}
      <g transform="translate(0, 47)">
        <path
          d="M 2 21 C 2 11, 8 5, 20 21 C 14 23, 6 23, 2 21 Z"
          fill="url(#logoPeelGradient)"
        />
        <path
          d="M 2 21 C 8 16, 15 14, 20 21 C 13 15, 7 16, 2 21 Z"
          fill="#ffffff"
          filter="url(#peelFoldShadow)"
        />
      </g>

      {/* Star Badge placed directly over the 'i' dot */}
      <g transform="translate(85, 3)">
        <path
          d="M 11 1 L 13.8 6.8 L 20 7.7 L 15.5 12.1 L 16.5 18.2 L 11 15.3 L 5.5 18.2 L 6.5 12.1 L 2 7.7 L 8.2 6.8 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M 11 1 L 13.8 6.8 L 20 7.7 L 15.5 12.1 L 16.5 18.2 L 11 15.3 L 5.5 18.2 L 6.5 12.1 L 2 7.7 L 8.2 6.8 Z"
          fill="url(#logoStarGradient)"
        />
      </g>
    </svg>
  );
}
