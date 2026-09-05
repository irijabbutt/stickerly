"use client";

import { PigSticker } from "@/components/stickers/PigSticker";
import { TurtleSticker } from "@/components/stickers/TurtleSticker";
import { BlobSticker } from "@/components/stickers/BlobSticker";
import { FloatingSticker } from "@/components/stickers/FloatingSticker";

export function StickerCharacters() {
  return (
    <section className="relative overflow-hidden py-8">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-primary blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 sm:gap-10">
        <FloatingSticker delay={0} className="h-20 w-20 sm:h-24 sm:w-24">
          <PigSticker className="h-full w-full drop-shadow-lg" />
        </FloatingSticker>
        <FloatingSticker delay={0.2} className="h-24 w-24 sm:h-28 sm:w-28">
          <BlobSticker className="h-full w-full drop-shadow-lg" />
        </FloatingSticker>
        <FloatingSticker delay={0.4} className="h-20 w-20 sm:h-24 sm:w-24">
          <TurtleSticker className="h-full w-full drop-shadow-lg" />
        </FloatingSticker>
      </div>
    </section>
  );
}
