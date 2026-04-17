const featuredFootage = [
  {
    title: "An Italian Wedding",
    place: "Sorrento, Italy",
    caption: "挙式からパーティーまで、当日の流れを短尺で確認できるハイライト。",
  },
  {
    title: "Hedsor House Wedding",
    place: "Buckinghamshire, UK",
    caption: "準備シーンからファーストダンスまでを9:16でまとめたサンプル。",
  },
  {
    title: "A Post Barn Wedding",
    place: "Newbury, UK",
    caption: "当日の空気感を残しながら、共有しやすいテンポで編集したサンプル。",
  },
  {
    title: "Marylebone, London",
    place: "London, UK",
    caption: "移動シーンを含む都市型ウェディングの進行が分かるショート。",
  },
  {
    title: "The Savoy, London",
    place: "London, UK",
    caption: "挙式と歓談の場面を整理し、SNSにそのまま使える構成で納品。",
  },
  {
    title: "The Italian Greyhound, London",
    place: "London, UK",
    caption: "レストランウェディングの距離感を中心にしたリアクション重視のクリップ。",
  },
  {
    title: "Rackleys Barn",
    place: "Chiltern Hills, UK",
    caption: "挙式前から退場後まで、必要場面をつないだ時系列サンプル。",
  },
  {
    title: "The Beacon",
    place: "Kent, UK",
    caption: "景色とゲスト表情をバランスよく収めた短尺シリーズ。",
  },
] as const;

export default function PortfolioPage() {
  return (
    <div className="mx-4 max-w-content px-4 py-8 md:mx-[200px] md:px-6 md:py-10 lg:px-8 lg:py-12">
      <section className="pb-12">
        <h1 className="mt-3 font-display text-[1.75rem] font-bold text-ink">
        ウェディング当日の思い出を、わたしたちらしく残す方法
        </h1>
        <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-ink-muted md:text-lg">
        スマホで結婚式の瞬間を撮影。結婚式のゲストとして、その日を写真や動画に収めることに専念する――そんな理想的な役割を想像してみてください。普段なら見逃してしまうような、特別な瞬間を捉えてくれるのです！
        </p>
      </section>

      <section className="mt-14 pt-14">
        <h2 className="mt-3 font-body text-[1.75rem] font-bold text-ink">
          ウェディングコンテンツ
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredFootage.map((item, index) => (
            <article key={item.title} className="bg-canvas-subtle p-3 animate-fade-up" style={{ animationDelay: `${index * 90}ms` }}>
              <div className="relative aspect-[9/16] border border-hairline bg-canvas p-3">
                <div className="absolute left-3 top-3 border border-hairline bg-canvas-subtle px-2 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  9:16 Reel
                </div>
                <div className="flex h-full items-center justify-center border border-dashed border-hairline bg-canvas-subtle/70 px-4 text-center">
                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">{item.title}</p>
                </div>
              </div>
              <div className="mt-3 bg-canvas px-4 py-4">
                <h3 className="font-display text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-1 font-body text-xs uppercase tracking-[0.08em] text-ink-muted">{item.place}</p>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
