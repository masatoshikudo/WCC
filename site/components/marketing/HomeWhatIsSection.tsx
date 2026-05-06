import Link from "next/link";
import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";

export function HomeWhatIsSection() {
  return (
    <section
      id="service-detail"
      className="w-full scroll-mt-24 border-t border-hairline bg-canvas pt-32 pb-32 md:pt-48 md:pb-48"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
            <h2
              className="font-heading font-normal text-[clamp(2rem,5vw,4rem)] leading-[1.12] text-ink md:sticky md:top-32"
              style={{ letterSpacing: "0.02em" }}
              lang="ja"
            >
              ウェディング
              <br />
              コンテンツとは
            </h2>
            <div className="flex flex-col gap-8">
              <p className="font-body text-base leading-relaxed text-ink-muted">
                写真は瞬間を、動画はその日の流れを残します。プロのフォト・ビデオを既に契約していても、SNSで気軽に共有できる縦動画として補完的に役立ちます。
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                「式の翌朝、コーヒーを淹れながらふたりで観返したい」「ゲストにすぐ送りたい」そんな方に向いています。
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
