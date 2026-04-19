export type HomeHighlightVideoSlide = {
  src: string;
  /** 未指定時は動画の先頭フレームが表示される */
  poster?: string;
};

/** `site/public/videos/` に配置したサンプル — ヒーローマルqueeと `#highlights` カードで共有 */
export const HOME_HIGHLIGHT_VIDEO_SLIDES: readonly HomeHighlightVideoSlide[] = [
  { src: "/videos/WC_movie_sample_1.mp4" },
  { src: "/videos/WC_movie_sample_2.mp4" },
  { src: "/videos/WC_movie_sample_3.mp4" },
  { src: "/videos/WC_movie_sample_4.mp4" },
  { src: "/videos/WC_movie_sample_5.mp4" },
  { src: "/videos/WC_movie_sample_6.mp4" },
];
