"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils/cn";

const EMBED_SCRIPT_SRC = "https://www.instagram.com/embed.js";

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void };
    };
  }
}

/**
 * Instagram embed.js をページ内で一度だけロードする。
 * - 既に `window.instgrm` があれば即 `onReady`（process は呼び側で実行）
 * - ロード中（script タグが既に存在）なら load を待って `onReady`
 * - 未ロードなら script を 1 本だけ挿入し、load 後に `onReady`
 */
function ensureEmbedScript(onReady: () => void): void {
  if (typeof window === "undefined") return;

  if (window.instgrm) {
    onReady();
    return;
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${EMBED_SCRIPT_SRC}"]`,
  );
  if (existing) {
    existing.addEventListener("load", onReady, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = EMBED_SCRIPT_SRC;
  script.async = true;
  script.addEventListener("load", onReady, { once: true });
  document.body.appendChild(script);
}

type InstagramEmbedProps = {
  /** 例: https://www.instagram.com/reel/XXXXXXXXX/ */
  permalink: string;
  className?: string;
};

/**
 * Instagram Reel / 投稿の埋め込み 1 本。
 * - CLS 対策として縦型 Reel を想定した min-height をラッパーに持たせる
 * - script は遅延ロード（ビューに入った時点で読み込み＆ process）
 * - マウント時 / permalink 変更時に process() を実行
 */
export function InstagramEmbed({ permalink, className }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const process = () => {
      window.instgrm?.Embeds.process();
    };

    // ビューに入った時点で初めて script をロード/process（lazy）
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ensureEmbedScript(process);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [permalink]);

  return (
    <div ref={containerRef} className={cn("mx-auto w-full max-w-[540px]", className)}>
      {/* 読み込み完了まで高さを確保してレイアウトシフトを抑える（縦型 Reel 想定） */}
      <div className="min-h-[640px] sm:min-h-[720px]">
        <blockquote
          // permalink を key 代わりに使い、URL 変更時はブロックを作り直して再描画させる
          key={permalink}
          className="instagram-media"
          data-instgrm-permalink={permalink}
          data-instgrm-version="14"
          style={{ margin: 0, width: "100%", minWidth: 0 }}
        />
      </div>
    </div>
  );
}

type InstagramEmbedListProps = {
  /** 並べて表示する Reel / 投稿の permalink 配列 */
  permalinks: string[];
  className?: string;
};

/** 複数の埋め込みを縦に中央寄せで並べるラッパー。 */
export function InstagramEmbedList({ permalinks, className }: InstagramEmbedListProps) {
  return (
    <div className={cn("flex flex-col items-center gap-12", className)}>
      {permalinks.map((permalink) => (
        <InstagramEmbed key={permalink} permalink={permalink} />
      ))}
    </div>
  );
}
