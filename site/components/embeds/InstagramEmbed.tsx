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
      {/*
        CLS 用プレースホルダ。embed.js は iframe を `position: absolute` で挿入し、
        その幅は親の幅を基準にするため、ここを `relative` にして 540px 幅へ閉じ込める。
        embed.js は process() 時に blockquote の offsetWidth を測って iframe の
        レイアウト幅 (wp) を決めるため、この親自身を `max-w-[540px]` で 540px に
        制約しておく（外側ラッパーだけでなくここでも閉じ込めることで、セクション幅
        まで広がって wp が 540 を超えるのを防ぐ）。
        min-height は読み込み中の高さ確保のみが目的で、iframe 化後の高さは
        Instagram が height 属性で制御する（こちらでは height/aspect を当てない）。
      */}
      <div className="relative mx-auto min-h-[640px] max-w-[540px] sm:min-h-[720px]">
        <blockquote
          // permalink を key 代わりに使い、URL 変更時はブロックを作り直して再描画させる
          key={permalink}
          className="instagram-media"
          data-instgrm-permalink={permalink}
          data-instgrm-version="14"
          // Instagram 公式の既定スタイルを尊重（embed.js が cssText を iframe へ複製するため、
          // 独自の width/height で上書きしない）。中央寄せと最大幅 540px のみ指定。
          style={{
            background: "#FFF",
            border: 0,
            borderRadius: 3,
            margin: "0 auto",
            maxWidth: 540,
            minWidth: 0,
            padding: 0,
            width: "calc(100% - 2px)",
          }}
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
