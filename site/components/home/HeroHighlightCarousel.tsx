"use client";

import { HOME_HIGHLIGHT_VIDEO_SLIDES, type HomeHighlightVideoSlide } from "@/lib/home-highlight-videos";
import {
  MOBILE_HERO_MAIN_HEIGHT_CSS,
  MOBILE_HERO_SP_MARQUEE_VERTICAL_PAD_CSS,
} from "@/lib/layout/mobile-dock";
import { cn } from "@/lib/utils/cn";

type Slide = HomeHighlightVideoSlide;

/** PC マルquee: 6 枚＝サンプル全本。無限ループ用に同じ並びを2倍（`marquee-loop` の -50% と対） */
const HERO_MARQUEE_ROW: Slide[] = [...HOME_HIGHLIGHT_VIDEO_SLIDES];

const MARQUEE_LOOP_SLIDES: Slide[] = [...HERO_MARQUEE_ROW, ...HERO_MARQUEE_ROW];

/** `globals.css` の `.animate-float-slow`（gentle-float）周期と揃える */
const HERO_FLOAT_PERIOD_SEC = 6;
const HERO_FLOAT_HALF_PERIOD_SEC = HERO_FLOAT_PERIOD_SEC / 2;

/** マルquee各スロットの先読み: 各「6枚ブロック」の先頭2枚だけ metadata、それ以外は none で帯域・デコードを抑制 */
function heroMarqueePreload(index: number): "none" | "metadata" {
  const lane = index % 6;
  if (lane <= 1) return "metadata";
  return "none";
}

function HeroHighlightFrame({
  slide,
  animateFloat,
  videoKey,
  floatDelaySec = 0,
  fillParent = false,
  marqueeIndex,
}: {
  slide: Slide;
  animateFloat: boolean;
  videoKey: string;
  floatDelaySec?: number;
  fillParent?: boolean;
  marqueeIndex: number;
}) {
  const preload = heroMarqueePreload(marqueeIndex);
  const fetchPriority =
    marqueeIndex % 6 === 0 ? ("high" as const) : marqueeIndex % 6 >= 4 ? ("low" as const) : undefined;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] bg-canvas",
        fillParent ? "h-full min-h-0 w-full" : "aspect-[9/16]",
        animateFloat && "animate-float-slow",
      )}
      style={
        animateFloat && floatDelaySec > 0
          ? { animationDelay: `${floatDelaySec}s` }
          : undefined
      }
    >
      <video
        key={videoKey}
        className="h-full w-full object-cover"
        src={slide.src}
        poster={slide.poster}
        muted
        playsInline
        autoPlay
        loop
        preload={preload}
        {...(fetchPriority ? { fetchPriority } : {})}
      />
    </div>
  );
}

/**
 * SP 動画カード: ヘッダー下〜固定ドック上の「使える高さ」に対する比率で高さを決める（幅は 9:16 で連動）
 * - SiteHeader SP: h-20（5rem） / 下端: `MOBILE_HERO_MAIN_HEIGHT_CSS`（`mobile-dock`）と同じ退避
 * - 横方向: ノッチ等は maxWidth で safe-area を min に含める
 * - heightRatio: 使える高さに対するカード高の比率（0〜1）
 * - maxHeightSvh: 極端に縦長端末での巨大化を抑える上限
 * - SP マルquee枠: `items-start` + `pt-16` / `pb-4`（縦合計は `MOBILE_HERO_SP_MARQUEE_VERTICAL_PAD_CSS` と一致）
 */
const SP_HERO_VIDEO_HEIGHT_RATIO = 0.8;
const SP_HERO_VIDEO_MAX_HEIGHT_SVH = 80;
const SP_HERO_VIDEO_MAX_WIDTH_PX = 340;
/** 92vw に加え、左右 safe-area の内側に収める */
const SP_HERO_CARD_MAX_WIDTH = `min(${SP_HERO_VIDEO_MAX_WIDTH_PX}px, 92vw, calc(100vw - env(safe-area-inset-left,0px) - env(safe-area-inset-right,0px) - 1.5rem))`;

export function HeroHighlightCarousel() {
  const spUsableForCard = `calc((${MOBILE_HERO_MAIN_HEIGHT_CSS}) - ${MOBILE_HERO_SP_MARQUEE_VERTICAL_PAD_CSS})`;
  const spCardHeight = `min(${SP_HERO_VIDEO_MAX_HEIGHT_SVH}svh, calc((${spUsableForCard}) * ${SP_HERO_VIDEO_HEIGHT_RATIO}))`;
  const spCardWidth = `min((${SP_HERO_CARD_MAX_WIDTH}), calc((${spCardHeight}) * 9 / 16))`;

  return (
    <>
      <div className="marquee-shell box-border flex h-full max-h-full min-h-0 min-w-0 w-full items-start overflow-hidden pt-16 pb-4 md:hidden">
        <div className="hero-marquee-track shrink-0 [animation-duration:56s]">
          {MARQUEE_LOOP_SLIDES.map((slide, index) => (
            <div
              key={`sp-${slide.src}-${index}`}
              className={`shrink-0 origin-center scale-[1.08] ${
                index % 2 === 0 ? "rotate-2" : "-rotate-2"
              }`}
              style={{
                height: spCardHeight,
                width: spCardWidth,
                maxWidth: SP_HERO_CARD_MAX_WIDTH,
              }}
            >
              <HeroHighlightFrame
                slide={slide}
                animateFloat
                videoKey={`sp-${slide.src}-${index}`}
                floatDelaySec={(index % 2) * HERO_FLOAT_HALF_PERIOD_SEC}
                fillParent
                marqueeIndex={index}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-shell hidden min-w-0 md:flex md:min-h-[max(36rem,48svh)] md:flex-1 md:flex-col md:justify-center lg:min-h-[max(44rem,56svh)]">
        <div className="hero-marquee-track shrink-0">
          {MARQUEE_LOOP_SLIDES.map((slide, index) => (
            <div
              key={`${slide.src}-${index}`}
              className={`w-[240px] shrink-0 origin-center scale-[1.2] sm:w-[260px] md:w-[280px] lg:w-[320px] ${
                index % 2 === 0 ? "rotate-2" : "-rotate-2"
              }`}
            >
              <HeroHighlightFrame
                slide={slide}
                animateFloat
                videoKey={`${slide.src}-${index}`}
                floatDelaySec={(index % 2) * HERO_FLOAT_HALF_PERIOD_SEC}
                marqueeIndex={index}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
