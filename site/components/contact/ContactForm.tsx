"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type FormData = {
  name: string;
  partnerName: string;
  email: string;
  phone: string;
  weddingDateFirst: string;
  weddingDateSecond: string;
  weddingDateThird: string;
  venue: string;
  guestCount: string;
  budget: string;
  message: string;
};

const initialForm: FormData = {
  name: "",
  partnerName: "",
  email: "",
  phone: "",
  weddingDateFirst: "",
  weddingDateSecond: "",
  weddingDateThird: "",
  venue: "",
  guestCount: "",
  budget: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section className="mt-8 max-w-prose space-y-4">
        <p className="font-body text-sm text-success">送信が完了しました。</p>
        <h2 className="font-display text-xl font-semibold text-ink">お問い合わせありがとうございます</h2>
        <p className="font-body leading-relaxed text-ink-muted">
          内容を確認後、2営業日以内を目安に返信します。お急ぎの場合はLINEをご利用ください。
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setForm(initialForm);
              setIsSubmitted(false);
            }}
            className="font-display inline-flex min-h-[52px] items-center justify-center border-2 border-strong bg-transparent px-7 text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-canvas"
          >
            入力に戻る
          </button>
          <Link
            href="/book"
            className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover md:inline-flex"
          >
            今すぐ予約する
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form id="contact-form" className="mt-8 max-w-lg space-y-6" onSubmit={onSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-body text-sm font-semibold text-ink">
            お名前
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <div>
          <label htmlFor="partnerName" className="font-body text-sm font-semibold text-ink">
            お相手のお名前（任意）
          </label>
          <input
            id="partnerName"
            name="partnerName"
            value={form.partnerName}
            onChange={(event) => setForm((prev) => ({ ...prev, partnerName: event.target.value }))}
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="font-body text-sm font-semibold text-ink">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <div>
          <label htmlFor="phone" className="font-body text-sm font-semibold text-ink">
            電話番号（テキスト / WhatsApp推奨）
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            required
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="weddingDateFirst" className="font-body text-sm font-semibold text-ink">
            希望日（第1候補）
          </label>
          <input
            id="weddingDateFirst"
            name="weddingDateFirst"
            type="date"
            value={form.weddingDateFirst}
            onChange={(event) => setForm((prev) => ({ ...prev, weddingDateFirst: event.target.value }))}
            required
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <div>
          <label htmlFor="weddingDateSecond" className="font-body text-sm font-semibold text-ink">
            希望日（第2候補）
          </label>
          <input
            id="weddingDateSecond"
            name="weddingDateSecond"
            type="date"
            value={form.weddingDateSecond}
            onChange={(event) => setForm((prev) => ({ ...prev, weddingDateSecond: event.target.value }))}
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <div>
          <label htmlFor="weddingDateThird" className="font-body text-sm font-semibold text-ink">
            希望日（第3候補）
          </label>
          <input
            id="weddingDateThird"
            name="weddingDateThird"
            type="date"
            value={form.weddingDateThird}
            onChange={(event) => setForm((prev) => ({ ...prev, weddingDateThird: event.target.value }))}
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="venue" className="font-body text-sm font-semibold text-ink">
            式場名 / エリア
          </label>
          <input
            id="venue"
            name="venue"
            value={form.venue}
            onChange={(event) => setForm((prev) => ({ ...prev, venue: event.target.value }))}
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <div>
          <label htmlFor="guestCount" className="font-body text-sm font-semibold text-ink">
            予定ゲスト人数（任意）
          </label>
          <input
            id="guestCount"
            name="guestCount"
            type="number"
            min={1}
            value={form.guestCount}
            onChange={(event) => setForm((prev) => ({ ...prev, guestCount: event.target.value }))}
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <div>
          <label htmlFor="budget" className="font-body text-sm font-semibold text-ink">
            ご予算（任意）
          </label>
          <input
            id="budget"
            name="budget"
            placeholder="例: 15万円前後"
            value={form.budget}
            onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="font-body text-sm font-semibold text-ink">
          ご相談内容（希望パッケージ・参考URL・質問など）
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
          required
          className="mt-2 w-full rounded-sm border-2 border-hairline bg-canvas px-3 py-2 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="font-display inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover"
        >
          送信する
        </button>
      </div>
    </form>
  );
}
