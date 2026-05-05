import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";
import { cn } from "@/lib/utils/cn";

const PRICING_SECTION_ROOT_CLASS = cn(
  "w-full scroll-mt-48 mt-24 border-t border-hairline pt-40 pb-0 md:mt-28 md:pt-48 md:pb-48",
  "bg-canvas",
);

/** `#pricing` チャンク読み込み中（アンカー維持） */
export function HomePricingSectionSkeleton() {
  return (
    <section id="pricing" className={PRICING_SECTION_ROOT_CLASS} aria-busy="true">
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto min-h-[12rem] max-w-5xl animate-pulse rounded-lg bg-ink/5 md:min-h-[16rem]" aria-hidden />
      </div>
    </section>
  );
}
