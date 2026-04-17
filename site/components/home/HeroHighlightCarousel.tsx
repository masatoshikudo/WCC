"use client";

import { useState } from "react";

const VIDEO_SLIDES = [
  {
    label: "9:16 Highlight",
    title: "Same-day Social Clip",
    description: "当日のうちに共有しやすい短尺ハイライト",
    src: "/videos/hero-01.mp4",
    poster: "/videos/hero-01.jpg",
  },
  {
    label: "9:16 Ceremony",
    title: "Ceremony Moments",
    description: "誓いのシーンを中心に、感情の流れを短く編集",
    src: "/videos/hero-02.mp4",
    poster: "/videos/hero-02.jpg",
  },
  {
    label: "9:16 Reception",
    title: "Reception Recap",
    description: "披露宴の表情や歓談を、SNS向けにテンポよく再構成",
    src: "/videos/hero-03.mp4",
    poster: "/videos/hero-03.jpg",
  },
] as const;

export function HeroHighlightCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = VIDEO_SLIDES[activeIndex];

  const handlePassEnd = () => {
    setActiveIndex((prev) => (prev + 1) % VIDEO_SLIDES.length);
  };

  return (
    <div className="hero-pass-mobile w-full" onAnimationIteration={handlePassEnd}>
      <div className="mx-auto w-full max-w-[240px] origin-center scale-[1.08] rotate-2 sm:max-w-[260px] md:max-w-[280px] lg:max-w-[320px]">
        <div className="relative aspect-[9/16] overflow-hidden border border-hairline bg-canvas-subtle animate-float-slow">
          <video
            key={activeSlide.src}
            className="h-full w-full object-cover"
            src={activeSlide.src}
            poster={activeSlide.poster}
            muted
            playsInline
            autoPlay
            loop
            preload="metadata"
          />

          <div className="absolute left-4 top-4 border border-strong bg-canvas/90 px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.08em] text-ink">
            {activeSlide.label}
          </div>

          <div className="absolute bottom-4 left-4 right-4 space-y-1 border border-hairline bg-canvas/92 p-3">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink">
              {activeSlide.title}
            </p>
            <p className="font-body text-xs leading-relaxed text-ink-muted">
              {activeSlide.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
