import Link from "next/link";
import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";

export function HomeDoINeedSection() {
  return (
    <section
      id="what-is-wcc"
      className="w-full scroll-mt-24 border-t-[1.5px] border-hairline bg-canvas pt-32 pb-32 md:pt-48 md:pb-48"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
            <h2
              className="font-heading font-normal text-[clamp(2rem,5vw,4rem)] leading-[1.12] text-ink"
              style={{ letterSpacing: "0.02em" }}
              lang="en"
            >
              Wedding
              <br />
              Content
              <br />
              Creator?
            </h2>
            <div className="flex flex-col gap-8">
              <p className="font-body text-base leading-relaxed text-ink-muted">
                当日の記録は、写真と本編ムービーで十分
                <br />
                そう考えるふたりには、このサービスは必要ありません
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                ただ、
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                翌日にはSNSに上げたい
                <br />
                家族にすぐ送りたい
                <br />
                余韻が残るうちに、ふたりで見返したい
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                ひとつでも当てはまるなら
                <br />
                このサービスはふたりに向いています
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 font-body text-xs uppercase tracking-[0.12em] text-ink hover:opacity-70"
              >
                LEARN MORE <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
