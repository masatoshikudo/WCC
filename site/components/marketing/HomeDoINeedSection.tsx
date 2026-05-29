import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";

export function HomeDoINeedSection() {
  return (
    <section
      id="what-is-wcc"
      className="w-full scroll-mt-24 border-t-[1.5px] border-hairline bg-canvas pt-32 pb-32 md:pt-48 md:pb-48"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-center md:gap-24 lg:gap-32">
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
              わたしたちは、結婚式当日の喜びと祝福を
              　<br />
              スマホで見返しやすい縦型動画として残すクリエイターです
              　<br />
              写真や本編ムービーを待つ時間も
              <br />
              ふたりにとって大切な時間だと考えています
              　</p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
              結婚式の翌日、ふたりで昨日をもう一度見返したい
              <br />
              離れている家族や友人にも、当日の空気を届けたい
              <br />
              ふたりらしい一日を、今の気持ちに近いまま残したい。
                <br />
                余韻が残るうちに、ふたりで見返したい
              </p>
              <p className="font-body text-base leading-relaxed text-ink-muted">
              そんな気持ちがひとつでもあるなら、
              <br />
              このサービスは、きっとふたりの役に立てます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
