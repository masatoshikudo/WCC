import { cn } from "@/lib/utils/cn";

/** Instagram の埋め込み iframe が想定する基準幅（これを超えると描画が崩れる）。 */
const EMBED_WIDTH = 540;
/** Reel カード（動画 + ヘッダー/フッター UI）が収まる余裕を持たせた高さ。 */
const EMBED_HEIGHT = 1100;

/**
 * permalink から Reel / 投稿の shortcode を抽出する。
 * 例: https://www.instagram.com/reel/DLXNT3kh9ed/ → "DLXNT3kh9ed"
 * reel / p / tv のいずれの形式にも対応する。
 */
function extractShortcode(permalink: string): string | null {
  const match = permalink.match(/instagram\.com\/(?:reel|p|tv)\/([^/?#]+)/i);
  return match ? match[1] : null;
}

type InstagramEmbedProps = {
  /** 例: https://www.instagram.com/reel/XXXXXXXXX/ */
  permalink: string;
  className?: string;
};

/**
 * Instagram Reel / 投稿の埋め込み 1 本。
 *
 * embed.js（blockquote → process() で iframe 化）方式は、process 時に測った幅で
 * Instagram 側のレイアウト幅 (wp) が決まり、親幅が 540px を超えると映像が潰れていた。
 * そこで本コンポーネントは Instagram 公式の embed iframe を直接描画し、`wp=540` /
 * `width=540` を明示して常に 540px 基準でレンダリングさせる。
 */
export function InstagramEmbed({ permalink, className }: InstagramEmbedProps) {
  const shortcode = extractShortcode(permalink);
  if (!shortcode) return null;

  return (
    <div className={cn("mx-auto w-full max-w-[540px]", className)}>
      <iframe
        src={`https://www.instagram.com/reel/${shortcode}/embed/?cr=1&v=14&wp=${EMBED_WIDTH}`}
        title="Instagram Reel"
        width={EMBED_WIDTH}
        height={EMBED_HEIGHT}
        frameBorder={0}
        scrolling="no"
        allowTransparency
        allowFullScreen
        loading="lazy"
        style={{
          display: "block",
          width: "100%",
          maxWidth: `${EMBED_WIDTH}px`,
          border: "none",
          margin: "0 auto",
          background: "#fff",
        }}
      />
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
