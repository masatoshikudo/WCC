export type HomeHighlightVideoSlide = {
  src: string;
  /** LCP 軽量化・遅延読み込み時の静止画（`public/images/highlight-posters/`） */
  poster: string;
};

/** `site/public/videos/` のサンプルとポスター — ヒーローマルqueeと `#highlights` で共有 */
export const HOME_HIGHLIGHT_VIDEO_SLIDES: readonly HomeHighlightVideoSlide[] = [
  { src: "/videos/WC_movie_sample_1.mp4", poster: "/images/highlight-posters/wc-sample-1.webp" },
  { src: "/videos/WC_movie_sample_2.mp4", poster: "/images/highlight-posters/wc-sample-2.webp" },
  { src: "/videos/WC_movie_sample_3.mp4", poster: "/images/highlight-posters/wc-sample-3.webp" },
  { src: "/videos/WC_movie_sample_4.mp4", poster: "/images/highlight-posters/wc-sample-4.webp" },
  { src: "/videos/WC_movie_sample_5.mp4", poster: "/images/highlight-posters/wc-sample-5.webp" },
  { src: "/videos/WC_movie_sample_6.mp4", poster: "/images/highlight-posters/wc-sample-6.webp" },
];
