import Image from "next/image";

import { cn } from "@/lib/utils/cn";

const DEFAULT_IMAGE_SRC = "/thumbnail.jpg";
const DEFAULT_REEL_URL = "https://www.instagram.com/reel/DLXNT3kh9ed/";
const DEFAULT_ALT = "ウェディング映像サンプル（Instagramで見る）";

type InstagramThumbnailCardProps = {
  /** 9:16 サムネイル画像のパス（public 配下） */
  imageSrc?: string;
  /** クリックで開く Instagram リールの URL */
  reelUrl?: string;
  /** 画像の代替テキスト */
  alt?: string;
  className?: string;
};

/**
 * Instagram リールへ誘導する 9:16 のクリッカブルなサムネイルカード。
 *
 * embed.js / iframe を使わず、自前の静止画サムネイル + 再生オーバーレイで
 * 「動画である」ことを示し、カード全体のクリックでリールを新規タブで開く。
 * 画像・リール URL・alt を prop 化しており、将来は複数枚を並べられる。
 */
export function InstagramThumbnailCard({
  imageSrc = DEFAULT_IMAGE_SRC,
  reelUrl = DEFAULT_REEL_URL,
  alt = DEFAULT_ALT,
  className,
}: InstagramThumbnailCardProps) {
  return (
    <a
      href={reelUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={alt}
      className={cn(
        "group relative mx-auto block aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-xl bg-canvas",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-18px_rgba(0,0,0,0.32)] ring-1 ring-hairline/15",
        "transition-[transform,box-shadow] duration-500 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_2px_6px_rgba(0,0,0,0.06),0_34px_64px_-20px_rgba(0,0,0,0.42)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      {/* サムネイル（9:16 を object-cover でフル表示。画像自体が 9:16 なのでクロップなし） */}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(min-width: 640px) 420px, 90vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
      />

      {/* 上下のグラデーション：映像らしい奥行きと、再生 UI／ラベルの可読性を確保 */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink/20 via-transparent to-ink/55 transition-opacity duration-500 group-hover:from-ink/15 group-hover:to-ink/60"
      />

      {/* 中央の再生ボタン */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex h-16 w-16 items-center justify-center">
          {/* ホバー時に静かに広がるリング（動画らしいインタラクション） */}
          <span
            aria-hidden
            className="absolute inset-0 scale-90 rounded-full ring-1 ring-canvas/60 opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.55] group-hover:opacity-100"
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-canvas/85 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.55)] ring-1 ring-canvas/60 backdrop-blur-[2px] transition duration-500 ease-out group-hover:scale-110 group-hover:bg-canvas">
            <svg
              className="h-6 w-6 translate-x-[2px] text-ink"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>

      {/* 下部の控えめなラベル */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 px-4 pb-5">
        <svg
          className="h-4 w-4 text-canvas/90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
        <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-canvas/95">
          Instagram で見る
        </span>
      </div>
    </a>
  );
}

type InstagramThumbnailCardItem = {
  imageSrc?: string;
  reelUrl?: string;
  alt?: string;
};

type InstagramThumbnailCardListProps = {
  /** 並べて表示するサムネイルカードの配列（将来複数枚に対応） */
  items: InstagramThumbnailCardItem[];
  className?: string;
};

/** 複数のサムネイルカードを縦に中央寄せで並べるラッパー。 */
export function InstagramThumbnailCardList({ items, className }: InstagramThumbnailCardListProps) {
  return (
    <div className={cn("flex flex-col items-center gap-12", className)}>
      {items.map((item) => (
        <InstagramThumbnailCard
          key={item.reelUrl ?? item.imageSrc}
          imageSrc={item.imageSrc}
          reelUrl={item.reelUrl}
          alt={item.alt}
        />
      ))}
    </div>
  );
}
