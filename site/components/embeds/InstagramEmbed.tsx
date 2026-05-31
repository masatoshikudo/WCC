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

/** Instagram 公式が配布する既定 permalink（utm 付き）。 */
const DEFAULT_PERMALINK =
  "https://www.instagram.com/reel/DLXNT3kh9ed/?utm_source=ig_embed&utm_campaign=loading";

/**
 * Instagram 公式の埋め込みコード（blockquote.instagram-media）を、style・data 属性を
 * 一切改変せずそのまま生成する。permalink 部分だけを差し替え可能にする。
 */
function buildEmbedHtml(permalink: string): string {
  return `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${permalink}" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:1px auto; max-width:540px; min-width:326px; padding:0; width:calc(100% - 2px);"></blockquote>`;
}

/**
 * embed.js をページ内で一度だけロードし、ロード完了で resolve する。
 * 既に `window.instgrm` があれば即 resolve（process は呼び側で実行）。
 */
function loadEmbedScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return;

    if (window.instgrm) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SCRIPT_SRC}"]`,
    );
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    document.body.appendChild(script);
  });
}

type InstagramEmbedProps = {
  /** 例: https://www.instagram.com/reel/XXXXXXXXX/（省略時は公式既定の Reel） */
  permalink?: string;
  className?: string;
};

/**
 * Instagram Reel / 投稿の埋め込み 1 本。
 *
 * Instagram 公式の埋め込みコード（blockquote）をそのまま注入し、embed.js が
 * `process()` で iframe 化する。幅・高さ・wp は一切こちらで指定せず、公式コードと
 * Instagram の挙動に完全に委ねる（独自の min-h / max-w / wp 制約は付けない）。
 */
export function InstagramEmbed({ permalink = DEFAULT_PERMALINK, className }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    void loadEmbedScript().then(() => {
      if (!cancelled) {
        window.instgrm?.Embeds.process();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [permalink]);

  return (
    <div
      ref={containerRef}
      // 幅は縛らない（max は付けない）。w-full で利用可能幅まで広げ、最終幅は blockquote
      // 自身の max-width:540px に委ねる。InstagramEmbedList の items-center により幅未指定
      // だと子が min-width(326px) まで縮むため、w-full で 540px に届かせる。
      className={cn("mx-auto w-full text-center", className)}
      // 公式 HTML をそのまま注入。permalink 変更時はブロックを作り直して再 process させる。
      key={permalink}
      dangerouslySetInnerHTML={{ __html: buildEmbedHtml(permalink) }}
    />
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
