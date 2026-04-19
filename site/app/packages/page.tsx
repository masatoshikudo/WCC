import { WCC_PACKAGE_PLANS } from "@/lib/plans";

export default function PackagesPage() {
  const extras = [
    "延長撮影: 個別お見積もり（税抜）",
    "対面ミーティング: 個別お見積もり（税抜）",
    "追加コンテンツクリエイター: 個別お見積もり（税抜）",
    "Polaroid Camera オプション: 個別見積もり",
    "モノクロ編集: 個別見積もり",
    "Vintage Film: 個別見積もり",
  ];

  const faqs = [
    {
      q: "お支払いのタイミングは？",
      a: "予約時に、お選びのプラン料金を一括でお支払いいただきます（税抜価格）。追加オプションや条件の詳細はご契約時にご案内します。",
    },
    {
      q: "どの機材で撮影しますか？",
      a: "最新のiPhoneを中心に、ジンバルやライトを併用します。撮影データはRAWでもお渡し可能です。",
    },
    {
      q: "フォト・ビデオチームと同時に入れますか？",
      a: "可能です。フォト/ムービーの進行を妨げない形で、SNS向けの瞬間を補完的に撮影します。",
    },
    {
      q: "海外ウェディングにも対応できますか？",
      a: "対応可能です。海外案件はBespokeで個別お見積もりします。",
    },
    {
      q: "撮影時間中の食事手配は必要ですか？",
      a: "6時間以上のプランでは、可能であればサプライヤーミールのご手配をお願いしています。",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-content px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-16">
      <h1 className="mt-3 font-display text-[1.75rem] font-bold text-ink">
        料金とプラン
      </h1>
      <p className="mt-3 max-w-prose font-body leading-relaxed text-ink-muted">
        当日の自然な瞬間を9:16で記録し、当日中〜翌日に受け取りやすい形で納品します。
      </p>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        {WCC_PACKAGE_PLANS.map((plan) => (
          <article key={plan.id} className="bg-canvas-subtle p-6">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              {plan.displayId}
            </p>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">{plan.name}</h2>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-ink">
              {plan.priceExTaxYen.toLocaleString("ja-JP")}
              <span className="text-2xl font-semibold">円</span>
              <span className="ml-1 align-baseline text-sm font-medium tabular-nums text-ink-muted sm:text-base">
                （税抜）
              </span>
            </p>
            <ul className="mt-4 space-y-2 font-body text-sm leading-relaxed text-ink-muted">
              {plan.items.map((item) => (
                <li key={item}>・{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-10 bg-canvas-subtle p-6">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
          Extras
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold text-ink">オプション</h2>
        <ul className="mt-4 space-y-2 font-body text-sm leading-relaxed text-ink-muted">
          {extras.map((item) => (
            <li key={item}>・{item}</li>
          ))}
        </ul>
        <p className="mt-4 font-body text-xs leading-relaxed text-ink-muted">
          ※ 交通費・宿泊費はエリアと拘束時間に応じて別途見積もりです。
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="bg-canvas-subtle p-6">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Bespoke Packages
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">オーダーメイドプラン</h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-ink-muted">
            既定プランに合わない場合は、撮影時間や納品内容を個別に設計できます。
          </p>
          <ul className="mt-4 space-y-2 font-body text-sm leading-relaxed text-ink-muted">
            <li>・オーダーメイド（撮影内容のカスタマイズ）: 個別お見積もり（税抜）</li>
            <li>・デスティネーション（遠方・海外）: 個別お見積もり（税抜）</li>
          </ul>
        </div>
        <div className="bg-canvas-subtle p-6">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Payment
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">お支払いフロー</h2>
          <ul className="mt-4 space-y-2 font-body text-sm leading-relaxed text-ink-muted">
            <li>・予約フォーム送信後、選択プランの料金を一括お支払いいただくことで日程確定</li>
            <li>・追加オプションは個別お見積もり・お支払い</li>
            <li>・最終Zoomで当日の動線を確認</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 bg-canvas-subtle p-6">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
          Next Steps
        </p>
        <ol className="mt-4 grid gap-3 font-body text-sm text-ink-muted md:grid-cols-3">
          <li className="bg-canvas p-4">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink">
              01
            </span>
            <p className="mt-2">日程・会場・希望内容を送信</p>
          </li>
          <li className="bg-canvas p-4">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink">
              02
            </span>
            <p className="mt-2">プラン料金の一括お支払いで日程確定</p>
          </li>
          <li className="bg-canvas p-4">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink">
              03
            </span>
            <p className="mt-2">挙式2〜4週間前に最終確認</p>
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
          FAQ
        </p>
        <h2 className="mt-2 font-display text-xl font-semibold text-ink">よくある質問</h2>
        <div className="mt-4 divide-y divide-hairline border-y border-hairline">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-4">
              <summary className="font-body flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
                {faq.q}
                <span className="text-ink-muted group-open:hidden">+</span>
                <span className="hidden text-ink-muted group-open:inline">−</span>
              </summary>
              <p className="mt-3 font-body leading-relaxed text-ink-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
