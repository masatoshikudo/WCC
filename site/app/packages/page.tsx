export default function PackagesPage() {
  const packagePlans = [
    {
      id: "01",
      name: "Blissful Beginnings",
      price: "£750",
      items: [
        "6時間のコンテンツ撮影",
        "24時間以内に納品",
        "事前Zoom打ち合わせ",
        "編集済みTikTok/Reels 2本",
        "当日のBTS + ディテール + 主要シーン",
        "RAWデータ一式",
      ],
    },
    {
      id: "02",
      name: "Happily Ever After",
      price: "£950",
      items: [
        "9時間のフルデイ撮影",
        "編集済みTikTok/Reels 2本",
        "1日のハイライト動画",
        "Blissful Beginningsの内容を含む",
      ],
    },
  ];

  const extras = [
    "延長撮影: £100 / 時間",
    "対面ミーティング: £65 / 時間",
    "追加コンテンツクリエイター: £250",
    "Polaroid Camera オプション: 個別見積もり",
    "モノクロ編集: 個別見積もり",
    "Vintage Film: 個別見積もり",
  ];

  const faqs = [
    {
      q: "デポジットは必要ですか？",
      a: "はい。予約時にデポジットが必要です。残額は挙式4週間前までにお支払いいただきます。",
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
    <div className="mx-4 max-w-content px-4 py-10 md:mx-[200px] md:px-6 md:py-12 lg:px-8 lg:py-16">
      <h1 className="mt-3 font-display text-[1.75rem] font-bold text-ink">
        料金とプラン
      </h1>
      <p className="mt-3 max-w-prose font-body leading-relaxed text-ink-muted">
        当日の自然な瞬間を9:16で記録し、当日中〜翌日に受け取りやすい形で納品します。
      </p>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        {packagePlans.map((plan, index) => (
          <article
            key={plan.name}
            className={index === 0 ? "bg-canvas-subtle p-6" : "bg-canvas-subtle p-6"}
          >
            <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              {plan.id}
            </p>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">{plan.name}</h2>
            <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-ink">{plan.price}</p>
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
            <li>・Bespoke: £550〜</li>
            <li>・Destination Coverage: £1500〜</li>
          </ul>
        </div>
        <div className="bg-canvas-subtle p-6">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Payment
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">お支払いフロー</h2>
          <ul className="mt-4 space-y-2 font-body text-sm leading-relaxed text-ink-muted">
            <li>・予約フォーム送信後、デポジット£300で日程確定</li>
            <li>・残額は挙式4週間前までにお支払い</li>
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
            <p className="mt-2">デポジット£300のお支払いで日程確定</p>
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
