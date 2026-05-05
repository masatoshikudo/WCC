import { HOME_HIGHLIGHT_VIDEO_SLIDES } from "@/lib/home-highlight-videos";
import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";
import { HighlightVideoCard } from "@/components/marketing/HighlightVideoCard";

/*
  HomeHighlightsSection

  位置: ヒーロー直後の第 2 セクション(LP_REDESIGN_PLAN.md 論点1 γ案)
  目的: テキストヒーローでブランドを語った直後に、output(9:16 縦動画)で
        サービスの実態を即座に示す。実績ゼロを動画作例でカバーする設計。

  動画ソース: lib/home-highlight-videos.ts(現状はダミー 6 本)
  本番運用時は実案件の動画ファイルに差し替える想定。

  キャプション(couple 名 / venue / 説明文)は M1 進行中のため非表示。
  実案件の納品が始まり、掲載許諾が取れた時点で再有効化を検討する。

  関連ドキュメント:
  - docs/WCC_ROADMAP.md(M1〜M2 で実績蓄積)
  - docs/drafts/LP_REDESIGN_PLAN.md 論点1
  - docs/drafts/LP_CURRENT_STATE.md 論点3
*/
export function HomeHighlightsSection() {
  return (
    <section
      id="highlights"
      className="w-full scroll-mt-24 border-t border-hairline bg-canvas pt-24 pb-32 md:pt-32 md:pb-48"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-display text-sm uppercase tracking-[0.15em] text-ink-muted">
            OUR WORK
          </p>
          <h2
            className="mt-4 font-heading font-normal text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.12] text-ink"
            style={{ letterSpacing: "0.02em" }}
          >
            その日の空気を
            <br />
            そのまま
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-ink-muted md:mt-8">
            その日の空気をそのまま残した、9:16 の縦動画作例。
            あの一日の高まりが、どんな形で残るのかをご覧ください。
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3">
          {HOME_HIGHLIGHT_VIDEO_SLIDES.map((slide) => (
            <HighlightVideoCard key={slide.src} slide={slide} />
          ))}
        </div>
      </div>
    </section>
  );
}
