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
        {/* Under-peel rainbow gradient */}
        <linearGradient id="logoPeelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="40%" stopColor="#d946ef" />
          <stop offset="70%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Star sticker gradient */}
        <linearGradient id="logoStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="30%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#f472b6" />
          <stop offset="85%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Soft shadow under the peel fold */}
        <filter id="peelShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-1" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Brand Text */}
      <text
        x="0"
        y="68"
        fontFamily="ui-rounded, 'Comfortaa', 'Nunito', system-ui, -apple-system, sans-serif"
        fontSize="64"
        fontWeight="900"
        fill="#18192b"
        style={{ letterSpacing: "-0.03em" }}
      >
        Stickerly
      </text>

      {/* Gradient reveal under the bottom-left peel on 'S' */}
      <path
        d="M 2 54 C 2 64, 8 72, 20 72 L 6 72 Z"
        fill="url(#logoPeelGradient)"
      />

      {/* Peeled white corner fold */}
      <path
        d="M 2 54 C 10 58, 16 64, 20 72 C 14 70, 7 64, 2 54 Z"
        fill="#ffffff"
        filter="url(#peelShadow)"
      />

      {/* Star sticker placed directly over the 'i' */}
      <g transform="translate(100, 10)">
        {/* Outer White Sticker Border */}
        <path
          d="M 10 1 L 12.8 6.8 L 19 7.7 L 14.5 12.1 L 15.5 18.2 L 10 15.3 L 4.5 18.2 L 5.5 12.1 L 1 7.7 L 7.2 6.8 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Star Gradient Fill */}
        <path
          d="M 10 1 L 12.8 6.8 L 19 7.7 L 14.5 12.1 L 15.5 18.2 L 10 15.3 L 4.5 18.2 L 5.5 12.1 L 1 7.7 L 7.2 6.8 Z"
          fill="url(#logoStarGradient)"
        />
      </g>
    </svg>
  );
}
