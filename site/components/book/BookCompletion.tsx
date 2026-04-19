"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { finalizeBookingAfterPayment } from "@/app/actions/booking";
import { SideColumnVisualPanel } from "@/components/layout/SideColumnVisualPanel";
import { TwoColumnCtaSection } from "@/components/layout/TwoColumnCtaSection";
import { WCC_BOOKING_CHECKOUT_KEY } from "@/lib/booking/session-storage";

type BookCompletionProps = {
  stripeCheckoutSessionId?: string | null;
};

export function BookCompletion({ stripeCheckoutSessionId = null }: BookCompletionProps) {
  const ranRef = useRef(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  useEffect(() => {
    if (ranRef.current) return;
    try {
      const raw = sessionStorage.getItem(WCC_BOOKING_CHECKOUT_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      sessionStorage.removeItem(WCC_BOOKING_CHECKOUT_KEY);
      ranRef.current = true;
      void (async () => {
        const result = await finalizeBookingAfterPayment(parsed, stripeCheckoutSessionId);
        if (!result.ok) {
          if (result.error === "expired") {
            setStatusNote("お手続きの有効期限が切れています。お手数ですが、もう一度ご予約からお進みください。");
          } else {
            setStatusNote("受付情報の保存に失敗しました。お手数ですがお問い合わせください。");
          }
          return;
        }
        if (result.insertedPayment && !result.emailSent) {
          setStatusNote("受付は完了しましたが、確認メールの送信に失敗した可能性があります。届かない場合はお問い合わせください。");
        }
      })();
    } catch {
      /* 破損ペイロード */
    }
  }, [stripeCheckoutSessionId]);

  return (
    <div className="mx-auto w-full max-w-content px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-16">
      <p className="font-body text-xs font-semibold text-ink-muted">受付完了</p>
      <h1 className="font-display mt-3 text-[1.75rem] font-bold text-ink">お申し込みを受け付けました</h1>
      <p className="mt-3 max-w-2xl font-body leading-relaxed text-ink-muted">
        お支払いのお手続きが完了しました。ご入力のメールアドレス宛に、内容を確認するご連絡をお送りします。
      </p>

      {statusNote ? (
        <p className="mt-4 max-w-prose font-body text-sm text-ink-muted" role="status">
          {statusNote}
        </p>
      ) : null}

      <TwoColumnCtaSection
        leftAside={
          <SideColumnVisualPanel eyebrow="このあとの流れ">
            <ul className="space-y-2 font-body text-sm leading-relaxed text-ink-muted">
              <li>・確認メールの到着をお待ちください</li>
              <li>・内容に相違がある場合はお問い合わせへ</li>
            </ul>
          </SideColumnVisualPanel>
        }
      >
        <h2 className="font-display text-xl font-bold text-ink">メールにて内容をご確認ください</h2>
        <p className="mt-4 max-w-prose font-body leading-relaxed text-ink-muted">
          お届けする文面に相違がないかご確認ください。ご不明点はお問い合わせからご連絡ください。
        </p>
        <p className="mt-2 max-w-prose font-body text-sm text-success">パッケージ料金（税抜・一括）のお支払いを確認しました。</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover md:inline-flex"
          >
            トップへ
          </Link>
        </div>
      </TwoColumnCtaSection>
    </div>
  );
}
