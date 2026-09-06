"use client";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className = "h-10 w-auto", ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 370 110"
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

        {/* Realistic drop shadow under the paper fold */}
        <filter id="peelFoldShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="-1.5" dy="2" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.32" />
        </filter>
      </defs>

      {/* Main Brand Vector Wordmark (Vector paths prevent system font layout shifts) */}
      <g className="fill-slate-900 dark:fill-white">
        {/* Letter 'S' */}
        <path d="M 38 18 C 22 18, 10 28, 10 42 C 10 56, 24 60, 36 63 C 46 66, 52 69, 52 76 C 52 83, 44 88, 32 88 C 21 88, 13 82, 11 74 L 11 70 C 11 66, 9 66, 7 68 C 3 71, 1 78, 1 82 C 1 94, 17 102, 34 102 C 55 102, 69 91, 69 74 C 69 59, 53 54, 40 51 C 30 48, 26 45, 26 40 C 26 34, 32 31, 40 31 C 48 31, 55 35, 57 41 C 58 44, 61 46, 65 46 C 70 46, 73 42, 73 37 C 73 26, 59 18, 38 18 Z" />

        {/* Letter 't' */}
        <path d="M 85 24 C 80 24, 77 27, 77 32 L 77 41 L 71 41 C 67 41, 65 44, 65 47 C 65 50, 67 53, 71 53 L 77 53 L 77 79 C 77 89, 83 95, 93 95 C 97 95, 101 93, 103 91 C 106 88, 105 84, 102 82 C 99 80, 96 81, 93 81 C 90 81, 88 79, 88 75 L 88 53 L 99 53 C 103 53, 105 50, 105 47 C 105 44, 103 41, 99 41 L 88 41 L 88 32 C 88 27, 85 24, 85 24 Z" />

        {/* Letter 'i' (Stem without dot — Star sticker replaces the dot) */}
        <path d="M 118 43 C 113 43, 110 46, 110 51 L 110 88 C 110 93, 113 95, 118 95 C 123 95, 126 93, 126 88 L 126 51 C 126 46, 123 43, 118 43 Z" />

        {/* Letter 'c' */}
        <path d="M 150 41 C 135 41, 124 52, 124 68 C 124 84, 135 95, 150 95 C 161 95, 168 89, 171 82 C 173 79, 171 75, 167 74 C 164 73, 161 75, 158 78 C 156 81, 153 83, 149 83 C 141 83, 135 76, 135 68 C 135 60, 141 53, 149 53 C 153 53, 156 55, 158 58 C 160 61, 164 62, 167 61 C 171 60, 173 56, 171 53 C 168 46, 161 41, 150 41 Z" />

        {/* Letter 'k' */}
        <path d="M 181 21 C 176 21, 173 24, 173 29 L 173 88 C 173 93, 176 95, 181 95 C 186 95, 189 93, 189 88 L 189 64 L 201 85 C 204 90, 208 94, 214 94 C 220 94, 224 89, 221 83 L 206 59 L 219 46 C 223 42, 222 36, 216 36 C 211 36, 208 38, 204 42 L 189 56 L 189 29 C 189 24, 186 21, 181 21 Z" />

        {/* Letter 'e' */}
        <path d="M 241 41 C 227 41, 217 52, 217 68 C 217 84, 227 95, 242 95 C 253 95, 261 88, 264 79 C 265 75, 262 73, 258 73 C 255 73, 252 75, 250 77 C 248 80, 245 83, 241 83 C 234 83, 228 77, 228 70 L 265 70 C 269 70, 271 67, 271 63 C 271 50, 259 41, 241 41 Z M 228 60 C 229 54, 234 50, 241 50 C 248 50, 253 54, 254 60 L 228 60 Z" />

        {/* Letter 'r' */}
        <path d="M 281 43 C 276 43, 273 46, 273 51 L 273 88 C 273 93, 276 95, 281 95 C 286 95, 289 93, 289 88 L 289 63 C 293 56, 299 53, 305 53 C 308 53, 310 52, 310 48 C 310 44, 307 42, 303 42 C 296 42, 291 46, 289 52 L 289 51 C 289 46, 286 43, 281 43 Z" />

        {/* Letter 'l' */}
        <path d="M 318 21 C 313 21, 310 24, 310 29 L 310 88 C 310 93, 313 95, 318 95 C 323 95, 326 93, 326 88 L 326 29 C 326 24, 323 21, 318 21 Z" />

        {/* Letter 'y' */}
        <path d="M 336 43 C 332 43, 329 46, 330 50 L 341 80 L 332 99 C 330 103, 332 107, 337 107 C 341 107, 344 105, 346 101 L 366 50 C 368 46, 364 43, 360 43 C 356 43, 353 45, 351 49 L 341 73 L 336 43 Z" />
      </g>

      {/* S-Corner Paper Peel Fold */}
      <g transform="translate(0, 64)">
        <path
          d="M 2 18 C 2 8, 8 2, 22 20 C 14 22, 5 22, 2 18 Z"
          fill="url(#stickerlyPeelGrad)"
        />
        <path
          d="M 2 18 C 8 13, 16 11, 22 20 C 14 13, 7 14, 2 18 Z"
          fill="#ffffff"
          filter="url(#peelFoldShadow)"
        />
      </g>

      {/* Die-Cut Star Sticker (Centered over the 'i' stem) */}
      <g transform="translate(106, 10)">
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
