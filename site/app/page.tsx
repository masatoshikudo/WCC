import Link from "next/link";
import { HeroHighlightCarousel } from "@/components/home/HeroHighlightCarousel";

export default function HomePage() {
  return (
    <div className="mx-4 max-w-content px-4 py-8 md:mx-[200px] md:px-6 md:py-10 lg:px-8 lg:py-12">
      <section className="grid gap-20 pb-10 lg:min-h-[calc(100svh-7rem)] md:gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="space-y-6">
          <h1
            className="font-heading text-[clamp(2.4rem,5.5vw,5rem)] font-bold leading-[0.95] text-ink"
            style={{ letterSpacing: "-0.05em" }}
            lang="en"
          >
            Wedding Content
            <br />
            Creator for
            <br />
            Your Wedding Day
          </h1>
          <p className="font-body max-w-xl text-lg leading-relaxed text-ink-muted">
            式当日のリアルな瞬間をスマホで残し、当日中から翌日までに見返せる編集した縦型ショート動画としてお届けします。
          </p>
        </div>

        <div className="relative min-w-0 animate-fade-up [animation-delay:120ms]">
          <div className="hero-track-sp">
            <HeroHighlightCarousel />
          </div>
        </div>
      </section>

      <section className="mt-24 border-t border-hairline pt-20 pb-20 md:mt-28 md:pt-24 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <h2
            className="mx-auto max-w-4xl text-center font-display text-[clamp(2rem,4.2vw,4rem)] leading-[1.12] text-ink"
            style={{ letterSpacing: "-0.03em" }}
          >
            結婚式のステキな瞬間を、
            <br />
            翌日にはシェアできる。
          </h2>

          <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-12">
            <p className="font-body text-base leading-relaxed text-ink-muted">
              Wedding Content Creatorは、演出ではなく当日その場の高まりをそのまま縦型のショート動画へ仕立てるサービスです。軽やかに流れる一本は、見返すたびにあの日の空気がよみがえり、気分が上がる記録になります。
            </p>

            <p className="font-body text-base leading-relaxed text-ink-muted">
              納品は、SNSにそのまま使える9:16の縦動画です。ハイライトは当日中から翌日を目安にお届けするため、ご家族やゲストともすぐ共有できます。
              <Link href="/about" className="ml-2 inline-block underline underline-offset-4 hover:opacity-70">
                サービス詳細
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 pt-16">
        <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight text-ink">
          このサービスで分かること
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          <li className="bg-canvas-subtle p-6">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              01
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">当日の自然な瞬間を残せる</h3>
            <p className="mt-2 font-body leading-relaxed text-ink-muted">
              おふたりとゲストの距離感を保ちながら、取りこぼしたくない場面を記録します。
            </p>
          </li>
          <li className="bg-canvas-subtle p-6">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              02
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">当日から翌日に受け取れる</h3>
            <p className="mt-2 font-body leading-relaxed text-ink-muted">
              ハイライトは当日中から翌日までに納品。式後すぐにご家族や友人と共有できます。
            </p>
          </li>
          <li className="bg-canvas-subtle p-6">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              03
            </p>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">SNSにそのまま使える</h3>
            <p className="mt-2 font-body leading-relaxed text-ink-muted">
              9:16で編集するため、投稿時のトリミングや再編集の手間を減らせます。
            </p>
          </li>
        </ul>
      </section>

      <section className="mt-16 pt-16">
        <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight text-ink">私たちの活動-主なハイライト</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              couple: "Alex & Jonathan",
              venue: "Sorrento Italy Wedding",
              description:
                "挙式から歓談まで、ゲストの反応を中心にまとめた当日ハイライト。",
            },
            {
              couple: "Editorial",
              venue: "Hedsor House Wedding",
              description:
                "準備から披露宴までの流れを短尺で確認できるサンプル。",
            },
            {
              couple: "Lucy and Chris",
              venue: "The Post Barn, Newbury",
              description:
                "ファーストルックと祝宴の場面を中心に構成した共有向け動画。",
            },
          ].map((item, index) => (
            <article key={item.venue} className="bg-canvas-subtle p-3 animate-fade-up" style={{ animationDelay: `${index * 120}ms` }}>
              <div className="relative aspect-[9/16] border border-hairline bg-canvas-subtle p-2">
                <div className="flex h-full items-center justify-center border border-dashed border-hairline bg-canvas/65">
                  <p className="font-display text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">9:16</p>
                </div>
              </div>
              <div className="mt-3 bg-canvas px-4 py-4 text-center">
                <p className="font-body text-sm font-semibold text-ink">{item.couple}</p>
                <h4 className="mt-1 font-display text-base font-semibold text-ink">{item.venue}</h4>
                <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            href="/portfolio"
            className="font-display hidden min-h-[44px] items-center justify-center border border-hairline px-5 text-xs font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-strong md:inline-flex"
          >
            実績一覧へ →
          </Link>
        </div>
      </section>

      <section className="mt-16 pt-16">
        <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight text-ink">
          お客様の声
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <blockquote className="bg-canvas-subtle p-6">
            <p className="font-body leading-relaxed text-ink">
              「披露宴後すぐに家族へ共有できました。自然な空気感がそのまま残っていて安心しました。」
            </p>
            <footer className="mt-3 font-body text-sm text-ink-muted">2025年秋婚 / 東京都</footer>
          </blockquote>
          <blockquote className="bg-canvas-subtle p-6">
            <p className="font-body leading-relaxed text-ink">
              「フォト・ムービーと役割が分かれていたので、記録用とSNS用をどちらも無理なく残せました。」
            </p>
            <footer className="mt-3 font-body text-sm text-ink-muted">2026年春婚 / 神奈川県</footer>
          </blockquote>
        </div>
        <div className="mt-6 grid gap-3 bg-canvas-subtle p-4 md:grid-cols-3">
          <p className="font-body text-sm text-ink-muted">
            <span className="font-display text-lg font-semibold text-ink">24h</span>
            <br />
            初回ハイライト納品目安
          </p>
          <p className="font-body text-sm text-ink-muted">
            <span className="font-display text-lg font-semibold text-ink">9:16</span>
            <br />
            すべてSNS投稿比率で編集
          </p>
          <p className="font-body text-sm text-ink-muted">
            <span className="font-display text-lg font-semibold text-ink">2Step</span>
            <br />
            予約相談→デポジット決済
          </p>
        </div>
      </section>

      <section className="mt-16 pt-16">
        <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight text-ink">
          対応範囲
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="bg-canvas-subtle p-6">
            <h3 className="font-display text-lg font-semibold text-ink">対応内容</h3>
            <ul className="mt-3 space-y-2 font-body text-sm leading-relaxed text-ink-muted">
              <li>・当日の空気感をiPhoneでリアルタイム収録</li>
              <li>・Reels/TikTok向けショートを短納期で編集</li>
              <li>・当日中〜翌日の共有に合わせた縦動画納品</li>
            </ul>
          </div>
          <div className="bg-canvas-subtle p-6">
            <h3 className="font-display text-lg font-semibold text-ink">対象外</h3>
            <ul className="mt-3 space-y-2 font-body text-sm leading-relaxed text-ink-muted">
              <li>・長編記録映像やアルバム制作は対象外</li>
              <li>・プロフォト/ビデオとの並走を前提に設計</li>
              <li>・撮影許可や持ち込み条件の調整代行は対象外</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16 pt-16">
        <h2 className="mt-3 font-display text-[1.75rem] font-bold leading-tight text-ink">
          よくある質問
        </h2>
        <div className="mt-6 divide-y divide-hairline border-y border-hairline">
          <details className="group py-4">
            <summary className="font-body flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
              プロのフォト・ビデオ撮影と何が違いますか？
              <span className="text-ink-muted group-open:hidden">+</span>
              <span className="hidden text-ink-muted group-open:inline">−</span>
            </summary>
            <p className="mt-3 font-body leading-relaxed text-ink-muted">
              WCCはスマホ撮影と短尺編集に特化し、当日中〜翌日の納品を重視します。長編記録映像やアルバム制作はプロフォト・ビデオの領域です。
            </p>
          </details>
          <details className="group py-4">
            <summary className="font-body flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
              納品までどれくらいかかりますか？
              <span className="text-ink-muted group-open:hidden">+</span>
              <span className="hidden text-ink-muted group-open:inline">−</span>
            </summary>
            <p className="mt-3 font-body leading-relaxed text-ink-muted">
              ハイライトは当日中〜24時間以内、追加編集は72時間以内が目安です。詳細は料金ページで確認できます。
            </p>
          </details>
          <details className="group py-4">
            <summary className="font-body flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
              予約前に相談できますか？
              <span className="text-ink-muted group-open:hidden">+</span>
              <span className="hidden text-ink-muted group-open:inline">−</span>
            </summary>
            <p className="mt-3 font-body leading-relaxed text-ink-muted">
              可能です。お問い合わせフォームまたはLINEから、日程と希望内容をご共有ください。
            </p>
          </details>
        </div>
      </section>

    </div>
  );
}
