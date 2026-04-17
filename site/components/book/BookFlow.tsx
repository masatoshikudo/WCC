"use client";

import { useMemo, useState } from "react";

const PLANS = [
  {
    id: "standard",
    label: "スタンダードプラン",
    priceLabel: "10万円（税抜）",
    depositNote: "デポジットはお見積りの50%が目安です",
  },
  {
    id: "premium",
    label: "プレミアムプラン",
    priceLabel: "30万円（税抜）",
    depositNote: "デポジットはお見積りの50%が目安です",
  },
] as const;

type PlanId = (typeof PLANS)[number]["id"];

type BookFlowProps = {
  paymentState?: "idle" | "cancel";
};

function StepIndicator({ step }: { step: 1 | 2 | 3 | 4 }) {
  const labels = ["選択", "確認", "決済", "完了"] as const;
  return (
    <div className="flex flex-wrap items-center gap-2 font-body text-sm text-ink-muted">
      {labels.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3 | 4;
        const active = n === step;
        return (
          <span key={label} className="flex items-center gap-2">
            {i > 0 ? <span className="text-ink-subtle" aria-hidden>—</span> : null}
            <span
              className={
                active
                  ? "font-semibold text-ink"
                  : n < step
                    ? "text-ink-muted"
                    : "text-ink-subtle"
              }
            >
              {n}/4 {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function BookFlow({ paymentState = "idle" }: BookFlowProps) {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_DEPOSIT_PAYMENT_LINK ?? "";
  const hasPaymentLink = paymentLink.length > 0;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [weddingDate, setWeddingDate] = useState("");
  const [dateUndecided, setDateUndecided] = useState(false);
  const [planId, setPlanId] = useState<PlanId>("standard");

  const plan = useMemo(
    () => PLANS.find((p) => p.id === planId) ?? PLANS[0],
    [planId],
  );

  const dateLabel = dateUndecided
    ? "未定"
    : weddingDate || "未入力";
  const stepPrimaryLabel = step === 1 ? "次へ：内容を確認" : step === 2 ? "次へ：デポジットを支払う" : "決済ページを開く";

  return (
    <div className="mx-4 max-w-content px-4 py-10 md:mx-[200px] md:px-6 md:py-12 lg:px-8 lg:py-16">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
        BOOK YOUR DATE
      </p>
      <h1 className="font-display mt-3 text-[1.75rem] font-bold text-ink">Let&apos;s get it booked...</h1>
      <p className="mt-3 max-w-2xl font-body leading-relaxed text-ink-muted">
        日程とプランを選び、内容を確認したうえでデポジットをお支払いください。不明点はいつでもお問い合わせからご相談いただけます。
      </p>

      {paymentState === "cancel" && (
        <p className="mt-4 max-w-prose font-body text-sm text-danger">
          お支払いは完了していません。内容を確認して、もう一度お進みください。
        </p>
      )}

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
              BOOKING FLOW
            </p>
            <ul className="space-y-2 font-body text-sm leading-relaxed text-ink-muted">
              <li>・ステップ1：挙式日とプランを選択</li>
              <li>・ステップ2：内容を確認</li>
              <li>・ステップ3：Stripeでデポジットを支払い</li>
            </ul>
          </div>
        </article>

        <div>
          <StepIndicator step={step} />

          <h2 className="font-display mt-6 text-xl font-bold text-ink">
            {step === 1 && "日程とプランを選ぶ"}
            {step === 2 && "内容の確認"}
            {step === 3 && "デポジットを支払う"}
          </h2>

          <div className="mt-5 grid gap-3 bg-canvas-subtle p-4 md:grid-cols-3">
            <p className="font-body text-xs text-ink-muted">
              <span className="font-display text-sm font-semibold text-ink">Secure</span>
              <br />
              決済はStripeで処理
            </p>
            <p className="font-body text-xs text-ink-muted">
              <span className="font-display text-sm font-semibold text-ink">Fast</span>
              <br />
              入力は最短2分
            </p>
            <p className="font-body text-xs text-ink-muted">
              <span className="font-display text-sm font-semibold text-ink">Clear</span>
              <br />
              条件を事前確認
            </p>
          </div>

      {step === 1 && (
        <div className="mt-8 max-w-lg space-y-6">
          <div>
            <label
              htmlFor="wedding-date"
              className="font-body text-sm font-semibold text-ink"
            >
              挙式日
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                id="wedding-date"
                type="date"
                disabled={dateUndecided}
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 sm:max-w-[240px]"
              />
              <label className="flex cursor-pointer items-center gap-2 font-body text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={dateUndecided}
                  onChange={(e) => {
                    setDateUndecided(e.target.checked);
                    if (e.target.checked) setWeddingDate("");
                  }}
                  className="h-4 w-4 rounded-sm border-hairline text-accent"
                />
                日程は未定
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="plan"
              className="font-body text-sm font-semibold text-ink"
            >
              プラン
            </label>
            <select
              id="plan"
              value={planId}
              onChange={(e) => setPlanId(e.target.value as PlanId)}
              className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:max-w-md"
            >
              {PLANS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} — {p.priceLabel}
                </option>
              ))}
            </select>
            <p className="mt-2 font-body text-sm text-ink-muted">{plan.depositNote}</p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover md:inline-flex"
            >
              次へ：内容を確認
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8 max-w-prose space-y-6">
          <dl className="space-y-3 rounded-md bg-canvas-subtle p-5 font-body text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">挙式日</dt>
              <dd className="text-right text-ink">{dateLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">プラン</dt>
              <dd className="text-right text-ink">{plan.label}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">料金</dt>
              <dd className="text-right text-ink">{plan.priceLabel}</dd>
            </div>
          </dl>

          <p className="font-body text-sm leading-relaxed text-ink-muted">
            本予約フローの決済は <strong className="text-ink">Stripe埋め込み</strong>
            で行います。カード情報は Stripe 上で処理され、当サイトには保存されません。
          </p>

          <div className="space-y-2 font-body text-sm leading-relaxed text-ink-muted">
            <p>
              <strong className="text-ink">キャンセル・変更</strong>
              ：正式な条件は契約時にご案内します。
            </p>
            <p>
              <strong className="text-ink">納品</strong>
              ：当日スマホ撮影・編集の条件は料金ページに準じます。
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="font-display inline-flex min-h-[52px] items-center justify-center bg-transparent pl-0 pr-7 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
            戻る
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover md:inline-flex"
            >
              次へ：デポジットを支払う
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-8 w-full space-y-6">
          <p className="font-body leading-relaxed text-ink-muted">
            デポジット（お見積り金額の約50%）は Stripe の埋め込みフォームでお支払いいただけます。決済完了後は
            「4/4 完了」画面へ遷移します。
          </p>

          {hasPaymentLink && (
            <div className="bg-canvas-subtle p-3">
              <iframe
                src={paymentLink}
                title="Stripe埋め込み決済"
                className="h-[640px] w-full rounded-sm border-2 border-hairline bg-canvas"
                loading="lazy"
              />
            </div>
          )}

          {!hasPaymentLink && (
            <div
              role="status"
              className="rounded-md border border-danger bg-canvas p-4 font-body text-sm text-danger"
            >
              <p className="font-semibold">決済リンクが未設定です</p>
              <p className="mt-2">
                Stripe ダッシュボードで Payment Link（デポジット用）を作成し、
                <code className="rounded-sm bg-canvas-subtle px-1 py-0.5 text-xs text-ink">
                  NEXT_PUBLIC_STRIPE_DEPOSIT_PAYMENT_LINK
                </code>
                に URL を設定してください。
              </p>
              <p className="mt-2 text-xs">
                成功時のリダイレクト先は{" "}
                <code className="rounded-sm bg-canvas px-1">
                  …/book?payment=success
                </code>{" "}
                と{" "}
                <code className="rounded-sm bg-canvas-subtle px-1">
                  …/book?payment=cancel
                </code>{" "}
                を設定してください。
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="font-display inline-flex min-h-[52px] items-center justify-center bg-transparent pl-0 pr-7 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-canvas"
            >
              戻る
            </button>
            {hasPaymentLink ? (
              <a
                href={paymentLink}
                className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover md:inline-flex"
              >
                決済ページを開く
              </a>
            ) : (
              <span
                className="font-display hidden min-h-[52px] min-w-[220px] cursor-not-allowed items-center justify-center rounded-full bg-ink-subtle px-8 text-sm font-semibold uppercase tracking-[0.08em] text-canvas opacity-80 md:inline-flex"
                aria-disabled
              >
                Stripe でデポジットを支払う
              </span>
            )}
          </div>
        </div>
      )}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:translate3d(0,0,0)] md:hidden">
        {step === 1 ? (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="font-display inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover"
          >
            {stepPrimaryLabel}
          </button>
        ) : null}

        {step === 2 ? (
          <button
            type="button"
            onClick={() => setStep(3)}
            className="font-display inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover"
          >
            {stepPrimaryLabel}
          </button>
        ) : null}

        {step === 3 && hasPaymentLink ? (
          <a
            href={paymentLink}
            className="font-display inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover"
          >
            {stepPrimaryLabel}
          </a>
        ) : null}

        {step === 3 && !hasPaymentLink ? (
          <span
            className="font-display inline-flex min-h-[52px] w-full cursor-not-allowed items-center justify-center rounded-full bg-ink-subtle px-8 text-sm font-semibold uppercase tracking-[0.08em] text-canvas opacity-80"
            aria-disabled
          >
            {stepPrimaryLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
