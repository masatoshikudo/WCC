import Link from "next/link";
import { HOME_ANCHOR_HREF } from "@/lib/site-links";
import { MOBILE_STICKY_LAYOUT_BOTTOM_PAD_CLASS } from "@/lib/layout/mobile-dock";
import { cn } from "@/lib/utils/cn";

export function HomeHeroSection() {
  return (
    <section
      id="hero"
      className={cn(
        "flex w-full scroll-mt-24 flex-col items-center justify-center bg-canvas",
        "min-h-[60svh] px-4 pt-16 pb-16 md:min-h-[70vh] md:px-6 md:pt-20 md:pb-20 lg:px-8",
        MOBILE_STICKY_LAYOUT_BOTTOM_PAD_CLASS,
      )}
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        <div className="animate-fade-up flex flex-col items-center gap-8 [animation-delay:120ms]">
          <h1
            className="font-heading font-light text-[clamp(2.25rem,6vw,5rem)] leading-[1.1] tracking-[0.02em] text-ink"
            lang="ja"
          >
            明日のふたりへ
          </h1>
          <p className="max-w-xl font-body text-lg leading-relaxed text-ink-muted">
            つくらない、ありのままの一日を
            <br />
            カメラを意識していない、ふとした表情まで
            <br />
            その日の気持ちに近いまま、ふたりの手元へ
          </p>
          <Link
            href={HOME_ANCHOR_HREF.pricing}
            className="font-display inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-full border border-ink px-8 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            パッケージを見る
          </Link>
        </div>
      </div>
    </section>
  );
}
