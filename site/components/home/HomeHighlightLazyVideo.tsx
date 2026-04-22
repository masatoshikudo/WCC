"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { HomeHighlightVideoSlide } from "@/lib/home-highlight-videos";
import { cn } from "@/lib/utils/cn";

type Props = {
  slide: HomeHighlightVideoSlide;
  className?: string;
};

/**
 * `#highlights` 用: ビューポート付近に来るまで動画 `src` を載せず、ポスターのみ表示して帯域とデコードを遅延する。
 */
export function HomeHighlightLazyVideo({ slide, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        setActive(true);
        observer.unobserve(root);
        observer.disconnect();
      },
      { root: null, rootMargin: "240px 0px 120px 0px", threshold: 0.01 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative h-full w-full overflow-hidden", className)}>
      {active ? (
        <video
          key={slide.src}
          className="h-full w-full object-cover"
          src={slide.src}
          poster={slide.poster}
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
        />
      ) : (
        <Image
          src={slide.poster}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 30vw"
          priority={false}
        />
      )}
    </div>
  );
}
