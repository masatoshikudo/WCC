"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BookMobileStickyDock } from "@/components/layout/MobileStickyDock";
import { SideColumnVisualPanel } from "@/components/layout/SideColumnVisualPanel";
import { TwoColumnCtaSection } from "@/components/layout/TwoColumnCtaSection";
import { recordBookingIntent } from "@/app/actions/booking";
import { WCC_BOOKING_CHECKOUT_KEY } from "@/lib/booking/session-storage";
import { WCC_BOOKING_PLANS, WCC_STANDARD_PACKAGE_DISCLAIMER } from "@/lib/plans";
import { HOME_ANCHOR_HREF, LEGAL_PAGE_HREF } from "@/lib/site-links";
import { emailFieldSchema } from "@/lib/validations/email";

type BookFlowProps = {
  paymentState?: "idle" | "cancel";
};

function newBookingAttemptId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const labels = ["入力", "確認", "お支払い"] as const;
  return (
    <div
      className="flex flex-wrap items-center gap-2 font-body text-sm text-ink-muted"
      aria-label="予約の進行状況"
    >
      {labels.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const active = n === step;
        return (
          <span key={label} className="flex items-center gap-2">
            {i > 0 ? <span className="text-ink-subtle" aria-hidden>—</span> : null}
            <span
              aria-current={active ? "step" : undefined}
              className={
                active
                  ? "font-semibold text-ink"
                  : n < step
                    ? "text-ink-muted"
                    : "text-ink-subtle"
              }
            >
              {n}/3 {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

const BOOK_PLAN = WCC_BOOKING_PLANS[0];
const BOOK_PLAN_ID = BOOK_PLAN.id;

export function BookFlow({ paymentState = "idle" }: BookFlowProps) {
  const paymentLink =
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STANDARD ?? "";
  const hasPaymentLink = paymentLink.length > 0;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [weddingDate, setWeddingDate] = useState("");
  const [dateUndecided, setDateUndecided] = useState(false);
  const [bookerEmail, setBookerEmail] = useState("");
  const [bookerName, setBookerName] = useState("");
  const [bookerEmailError, setBookerEmailError] = useState<string | null>(null);
  /** ステップ3で発行。intent / 完了画面の payment と突き合わせる */
  const [bookingAttemptId, setBookingAttemptId] = useState<string | null>(null);

  const dateLabel = dateUndecided
    ? "未定"
    : weddingDate || "未入力";
  const stepPrimaryLabel = step === 1 ? "次へ：内容を確認" : step === 2 ? "次へ：お支払いへ" : "決済ページを開く";

  useEffect(() => {
    if (step !== 3) {
      setBookingAttemptId(null);
      return;
    }
    setBookingAttemptId((k) => k ?? newBookingAttemptId());
  }, [step]);

  useEffect(() => {
    if (step !== 3 || !bookingAttemptId) return;
    const payload = {
      v: 1 as const,
      attemptId: bookingAttemptId,
      email: bookerEmail.trim(),
      bookerName: bookerName.trim() ? bookerName.trim() : null,
      weddingDate,
      dateUndecided,
      planId: BOOK_PLAN_ID,
      planLabel: BOOK_PLAN.label,
      priceLabel: BOOK_PLAN.priceLabel,
      savedAt: Date.now(),
    };
    try {
      sessionStorage.setItem(WCC_BOOKING_CHECKOUT_KEY, JSON.stringify(payload));
    } catch {
      /* sessionStorage 不可 */
    }
  }, [step, bookingAttemptId, bookerEmail, bookerName, weddingDate, dateUndecided]);

  useEffect(() => {
    if (step !== 3 || !bookingAttemptId) return;
    void recordBookingIntent({
      attemptId: bookingAttemptId,
      email: bookerEmail.trim(),
      bookerName: bookerName.trim() ? bookerName.trim() : null,
      weddingDate,
      dateUndecided,
      planId: BOOK_PLAN_ID,
      planLabel: BOOK_PLAN.label,
      priceLabel: BOOK_PLAN.priceLabel,
    });
  }, [step, bookingAttemptId, bookerEmail, bookerName, weddingDate, dateUndecided]);

  function goToStep2() {
    const parsed = emailFieldSchema.safeParse(bookerEmail.trim());
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "入力内容を確認してください";
      setBookerEmailError(msg);
      return;
    }
    setBookerEmailError(null);
    setStep(2);
  }

  return (
    <div className="mx-auto w-full max-w-content px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-16">
      <p className="font-body text-xs font-semibold text-ink-muted">ご予約（お支払い）</p>
      <h1 className="font-display mt-3 text-[1.75rem] font-bold text-ink">日程のお申し込み</h1>
      <p className="mt-3 max-w-2xl font-body leading-relaxed text-ink-muted">
        次の3ステップで、入力内容と料金をご確認のうえ、パッケージ料金（税抜）を一括でお支払いいただきます。決済は Stripe の専用ページで行われ、カード番号は当サイトに保存されません。ご不明点はお問い合わせからどうぞ。
      </p>

      {paymentState === "cancel" && (
        <p className="mt-4 max-w-prose font-body text-sm text-danger">
          お支払いは完了していません。内容を確認して、もう一度お進みください。
        </p>
      )}

      <TwoColumnCtaSection
        leftAside={
          <SideColumnVisualPanel eyebrow="ご予約の流れ（3ステップ）">
            <ul className="space-y-2 font-body text-sm leading-relaxed text-ink-muted">
              <li>・挙式日・連絡先メールを入力</li>
              <li>・内容と料金（税抜）を確認</li>
              <li>・Stripeのページでカード決済（一括）</li>
            </ul>
          </SideColumnVisualPanel>
        }
      >
          <StepIndicator step={step} />

          <h2 className="font-display mt-6 text-xl font-bold text-ink">
            {step === 1 && "日程・連絡先を入力"}
            {step === 2 && "内容と料金の確認"}
            {step === 3 && "お支払い（税抜・一括）"}
          </h2>

          <div className="mt-5 rounded-sm border border-hairline bg-canvas-subtle p-4">
            <p className="font-body text-sm leading-relaxed text-ink-muted">
              お支払い前に、プラン名と金額がご希望どおりか必ずご確認ください。料金・納品の詳細は
              <Link href={HOME_ANCHOR_HREF.pricing} className="text-ink underline underline-offset-4 hover:opacity-80">
                料金・プラン
              </Link>
              の記載に準じます。ご質問は
              <Link href="/contact" className="text-ink underline underline-offset-4 hover:opacity-80">
                お問い合わせ
              </Link>
              から。
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
            <p className="font-body text-sm font-semibold text-ink">パッケージ</p>
            <p className="mt-2 rounded-sm border-2 border-hairline bg-canvas px-3 py-3 font-body text-sm text-ink sm:max-w-md">
              {BOOK_PLAN.label} — {BOOK_PLAN.priceLabel}
            </p>
            <p className="mt-2 font-body text-sm text-ink-muted">{BOOK_PLAN.planNote}</p>
            <p className="mt-3 font-body text-xs leading-relaxed text-ink-muted">
              {WCC_STANDARD_PACKAGE_DISCLAIMER}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="booker-email" className="font-body text-sm font-semibold text-ink">
                連絡先メール
              </label>
              <input
                id="booker-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={bookerEmail}
                onChange={(e) => {
                  setBookerEmail(e.target.value);
                  if (bookerEmailError) setBookerEmailError(null);
                }}
                aria-invalid={bookerEmailError ? true : undefined}
                aria-describedby={bookerEmailError ? "booker-email-error" : undefined}
                className={`mt-2 min-h-[44px] w-full rounded-sm border-2 bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${bookerEmailError ? "border-red-600 focus-visible:outline-red-600" : "border-hairline focus-visible:outline-accent"}`}
              />
              {bookerEmailError ? (
                <p id="booker-email-error" className="mt-1 font-body text-xs text-red-700">
                  {bookerEmailError}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="booker-name" className="font-body text-sm font-semibold text-ink">
                お名前（任意）
              </label>
              <input
                id="booker-name"
                autoComplete="name"
                value={bookerName}
                onChange={(e) => setBookerName(e.target.value)}
                className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={goToStep2}
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
              <dt className="text-ink-muted">連絡先メール</dt>
              <dd className="break-all text-right text-ink">{bookerEmail.trim()}</dd>
            </div>
            {bookerName.trim() ? (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">お名前</dt>
                <dd className="text-right text-ink">{bookerName.trim()}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">パッケージ</dt>
              <dd className="text-right text-ink">{BOOK_PLAN.label}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">料金</dt>
              <dd className="text-right text-ink">{BOOK_PLAN.priceLabel}</dd>
            </div>
          </dl>

          <p className="font-body text-sm leading-relaxed text-ink-muted">
            お支払いは <strong className="text-ink">Stripe の決済ページ</strong>
            で行います。カード情報は Stripe 上で処理され、当サイトには保存されません。
          </p>

          <div className="space-y-2 font-body text-sm leading-relaxed text-ink-muted">
            <p>
              <strong className="text-ink">キャンセル・変更</strong>
              ：正式な条件は契約時にご案内します。
              <Link href={LEGAL_PAGE_HREF.tokushoho} className="ml-1 text-ink underline underline-offset-4 hover:opacity-80">
                特定商取引法に基づく表記
              </Link>
              もあわせてご確認ください。
            </p>
            <p>
              <strong className="text-ink">納品</strong>
              ：当日スマホ撮影・編集の条件は
              <Link href={HOME_ANCHOR_HREF.pricing} className="text-ink underline underline-offset-4 hover:opacity-80">
                料金・プラン
              </Link>
              に準じます。
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
              次へ：お支払いへ
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-8 w-full space-y-6">
          <p className="font-body leading-relaxed text-ink-muted">
            パッケージ料金（一括）は Stripe の決済ページでお支払いください（セキュリティのため、決済画面を当サイト内に埋め込むことはできません）。下のボタンから移動し、決済が完了すると受付完了の画面が表示されます。
          </p>

          {hasPaymentLink && (
            <div className="rounded-sm border-2 border-hairline bg-canvas-subtle p-6">
              <p className="font-body text-sm leading-relaxed text-ink-muted">
                お支払いは Stripe のページが開いたあとに行います。カード情報は当サイトを経由しません。
              </p>
              <a
                href={paymentLink}
                className="font-display mt-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover md:mt-5 md:w-auto md:min-w-[280px]"
              >
                決済ページを開く
              </a>
            </div>
          )}

          {!hasPaymentLink && (
            <div
              role="status"
              className="rounded-md border border-danger bg-canvas p-4 font-body text-sm text-danger"
            >
              <p className="font-semibold">決済リンクが未設定です</p>
              <p className="mt-2">
                Stripe ダッシュボードで Payment Link を作成し、
                <code className="rounded-sm bg-canvas-subtle px-1 py-0.5 text-xs text-ink">
                  NEXT_PUBLIC_STRIPE_PAYMENT_LINK_STANDARD
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
            {!hasPaymentLink ? (
              <span
                className="font-display hidden min-h-[52px] min-w-[220px] cursor-not-allowed items-center justify-center rounded-full bg-ink-subtle px-8 text-sm font-semibold uppercase tracking-[0.08em] text-canvas opacity-80 md:inline-flex"
                aria-disabled
              >
                Stripe でお支払い
              </span>
            ) : null}
          </div>
        </div>
      )}
      </TwoColumnCtaSection>

      <BookMobileStickyDock
        step={step}
        hasPaymentLink={hasPaymentLink}
        paymentLink={paymentLink}
        stepPrimaryLabel={stepPrimaryLabel}
        onStep1Next={goToStep2}
        onStep2Next={() => setStep(3)}
      />
    </div>
  );
}
