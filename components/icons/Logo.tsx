"use client";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "h-10 w-auto", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 380 110"
      fill="none"
      role="img"
      aria-label="Stickerly"
      className={className}
      {...props}
    >
      <defs>
        {/* Under-peel rainbow gradient */}
        <linearGradient id="stickerlyPeelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="45%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {/* Star sticker gradient */}
        <linearGradient id="stickerlyStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="25%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="75%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* Soft shadow for the peel fold */}
        <filter id="peelFoldShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="-1" dy="1.5" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Main Vector Wordmark (Paths guarantee 100% exact rendering across all OSs/Browsers) */}
      <g className="fill-slate-900 dark:fill-white">
        {/* Letter 'S' */}
        <path d="M 42 22 C 24 22, 12 32, 12 46 C 12 60, 26 64, 38 67 C 48 70, 53 73, 53 80 C 53 87, 45 92, 33 92 C 22 92, 14 86, 12 78 L 12 74 C 12 70, 10 70, 8 72 C 4 75, 2 82, 2 86 C 2 98, 18 106, 35 106 C 56 106, 70 95, 70 78 C 70 63, 54 58, 41 55 C 31 52, 27 49, 27 44 C 27 38, 33 35, 41 35 C 49 35, 56 39, 58 45 C 59 48, 62 50, 66 50 C 71 50, 74 46, 74 41 C 74 30, 60 22, 42 22 Z" />

        {/* Letter 't' */}
        <path d="M 85 28 C 81 28, 78 31, 78 35 L 78 44 L 72 44 C 68 44, 66 47, 66 50 C 66 53, 68 56, 72 56 L 78 56 L 78 82 C 78 92, 84 98, 94 98 C 98 98, 102 96, 104 94 C 107 91, 106 87, 103 85 C 100 83, 97 84, 94 84 C 91 84, 89 82, 89 78 L 89 56 L 100 56 C 104 56, 106 53, 106 50 C 106 47, 104 44, 100 44 L 89 44 L 89 35 C 89 31, 86 28, 85 28 Z" />

        {/* Letter 'i' (Stem without dot - Star acts as the dot) */}
        <path d="M 120 46 C 115 46, 112 49, 112 54 L 112 91 C 112 96, 115 98, 120 98 C 125 98, 128 96, 128 91 L 128 54 C 128 49, 125 46, 120 46 Z" />

        {/* Letter 'c' */}
        <path d="M 152 44 C 137 44, 126 55, 126 71 C 126 87, 137 98, 152 98 C 163 98, 170 92, 173 85 C 175 82, 173 78, 169 77 C 166 76, 163 78, 160 81 C 158 84, 155 86, 151 86 C 143 86, 137 79, 137 71 C 137 63, 143 56, 151 56 C 155 56, 158 58, 160 61 C 162 64, 166 65, 169 64 C 173 63, 175 59, 173 56 C 170 49, 163 44, 152 44 Z" />

        {/* Letter 'k' */}
        <path d="M 183 24 C 178 24, 175 27, 175 32 L 175 91 C 175 96, 178 98, 183 98 C 188 98, 191 96, 191 91 L 191 67 L 203 88 C 206 93, 210 97, 216 97 C 222 97, 226 92, 223 86 L 208 62 L 221 49 C 225 45, 224 39, 218 39 C 213 39, 210 41, 206 45 L 191 59 L 191 32 C 191 27, 188 24, 183 24 Z" />

        {/* Letter 'e' */}
        <path d="M 243 44 C 229 44, 219 55, 219 71 C 219 87, 229 98, 244 98 C 255 98, 263 91, 266 82 C 267 78, 264 76, 260 76 C 257 76, 254 78, 252 80 C 250 83, 247 86, 243 86 C 236 86, 230 80, 230 73 L 267 73 C 271 73, 273 70, 273 66 C 273 53, 261 44, 243 44 Z M 230 63 C 231 57, 236 53, 243 53 C 250 53, 255 57, 256 63 L 230 63 Z" />

        {/* Letter 'r' */}
        <path d="M 283 46 C 278 46, 275 49, 275 54 L 275 91 C 275 96, 278 98, 283 98 C 288 98, 291 96, 291 91 L 291 66 C 295 59, 301 56, 307 56 C 310 56, 312 55, 312 51 C 312 47, 309 45, 305 45 C 298 45, 293 49, 291 55 L 291 54 C 291 49, 288 46, 283 46 Z" />

        {/* Letter 'l' */}
        <path d="M 320 24 C 315 24, 312 27, 312 32 L 312 91 C 312 96, 315 98, 320 98 C 325 98, 328 96, 328 91 L 328 32 C 328 27, 325 24, 320 24 Z" />

        {/* Letter 'y' */}
        <path d="M 338 46 C 334 46, 331 49, 332 53 L 343 83 L 334 102 C 332 106, 334 110, 339 110 C 343 110, 346 108, 348 104 L 368 53 C 370 49, 366 46, 362 46 C 358 46, 355 48, 353 52 L 343 76 L 338 46 Z" />
      </g>

      {/* Peel Effect on bottom-left curve of 'S' */}
      <g transform="translate(1, 68)">
        <path
          d="M 2 16 C 2 6, 8 0, 22 18 C 14 20, 5 20, 2 16 Z"
          fill="url(#stickerlyPeelGrad)"
        />
        <path
          d="M 2 16 C 8 11, 16 9, 22 18 C 14 11, 7 12, 2 16 Z"
          fill="#ffffff"
          filter="url(#peelFoldShadow)"
        />
      </g>

      {/* Rainbow Star Sticker (Replaces the 'i' dot cleanly) */}
      <g transform="translate(108, 12)">
        <path
          d="M 12 1 L 15.2 7.8 L 22.4 8.8 L 17.2 13.9 L 18.4 21.1 L 12 17.7 L 5.6 21.1 L 6.8 13.9 L 1.6 8.8 L 8.8 7.8 Z"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M 12 1 L 15.2 7.8 L 22.4 8.8 L 17.2 13.9 L 18.4 21.1 L 12 17.7 L 5.6 21.1 L 6.8 13.9 L 1.6 8.8 L 8.8 7.8 Z"
          fill="url(#stickerlyStarGrad)"
        />
      </g>
    </svg>
  );
}
