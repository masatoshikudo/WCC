import Link from "next/link";

export function BookCompletion() {
  return (
    <div className="mx-4 max-w-content px-4 py-10 md:mx-[200px] md:px-6 md:py-12 lg:px-8 lg:py-16">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
        BOOK YOUR DATE
      </p>
      <h1 className="font-display mt-3 text-[1.75rem] font-bold text-ink">Let&apos;s get it booked...</h1>
      <p className="mt-3 max-w-2xl font-body leading-relaxed text-ink-muted">
        デポジットのお支払いが完了しました。ご予約内容の確認をメールでお送りします。
      </p>

      <section className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <article className="bg-canvas-subtle p-4 md:p-5">
          <div className="relative overflow-hidden">
            <img
              src="https://images.squarespace-cdn.com/content/v1/67b4555002a42e199321ce7b/18ecda9e-8f28-4a2b-9ca3-3d0b0e82f878/The-Social-Sisters-Content-Creators-Social-Media-Creation-BTS-3.jpg?format=1500w"
              alt="Wedding content creator capturing moments with an iPhone"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-4 space-y-4">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              ALL SET
            </p>
            <ul className="space-y-2 font-body text-sm leading-relaxed text-ink-muted">
              <li>・確認メールの到着をお待ちください</li>
              <li>・内容に相違があればお問い合わせへ</li>
            </ul>
          </div>
        </article>

        <div>
          <p className="font-body text-sm text-ink-muted">ステップ 4 / 4 — 完了</p>
          <h2 className="font-display mt-4 text-xl font-bold text-ink">お支払いを受け付けました</h2>
          <p className="mt-4 max-w-prose font-body leading-relaxed text-ink-muted">
            ご予約内容の確認メールを順次お送りします。内容に相違がある場合はお問い合わせください。
          </p>
          <p className="mt-2 max-w-prose font-body text-sm text-success">デポジットのお支払いが完了しました。</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover md:inline-flex"
            >
              トップへ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
