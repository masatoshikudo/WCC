import Link from "next/link";
import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";

export function HomeDoINeedSection() {
  return (
    <section
      id="what-is-wcc"
      className="w-full scroll-mt-24 border-t border-hairline bg-canvas pt-32 pb-32 md:pt-48 md:pb-48"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
            <h2
              className="font-heading font-normal text-[clamp(2rem,5vw,4rem)] leading-[1.12] text-ink md:sticky md:top-32"
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
                Wedding Content Creator（以下、WCC）は、結婚式当日におふたりのそばで取材する担当です。iPhoneで式の流れを記録し、あとから見て情景がつながる短い映像に編集します。
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
                大掛かりな演出を組み立てる役割ではなく、近い距離から拾った表情やゲストの反応を、一本の流れとして立ち上げます。プロの本編ムービーとは役割が異なり、当日の空気を手軽に残したい方向けの記録です。
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/book"
                  className="font-display inline-flex min-h-[52px] min-w-[200px] items-center justify-center self-start rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-opacity hover:opacity-80"
                >
                  まず相談する
                </Link>
                <p className="font-body text-xs leading-relaxed text-ink-muted">
                  日程が未定でもご相談いただけます
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
