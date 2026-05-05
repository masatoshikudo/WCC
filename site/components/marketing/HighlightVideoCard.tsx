"use client";

import { useRef, useState } from "react";
import type { HomeHighlightVideoSlide } from "@/lib/home-highlight-videos";

type Props = {
  slide: HomeHighlightVideoSlide;
};

export function HighlightVideoCard({ slide }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    videoRef.current?.play();
    setPlaying(true);
  }

  return (
    <div className="relative aspect-[9/16] overflow-hidden bg-canvas">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={slide.src}
        poster={slide.poster}
        playsInline
        preload="metadata"
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-ink/10 transition-colors hover:bg-ink/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
          aria-label="動画を再生"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-canvas shadow-sm">
            <svg
              className="h-5 w-5 translate-x-0.5 text-ink"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
