"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { submitContactInquiry } from "@/app/actions/contact";
import { contactFormDefaultValues, contactFormSchema, type ContactFormValues } from "@/lib/validations/contact";

function fieldErrorClass(hasError: boolean) {
  return hasError
    ? "border-red-600 focus-visible:outline-red-600"
    : "border-hairline focus-visible:outline-accent";
}

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactFormDefaultValues,
  });

  const onSubmit = (data: ContactFormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitContactInquiry(data);
      if (result.ok) {
        setIsSubmitted(true);
        reset(contactFormDefaultValues);
      } else {
        setServerError(result.error);
      }
    });
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
              setIsSubmitted(false);
              setServerError(null);
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
    <form id="contact-form" className="mt-8 max-w-lg space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError ? (
        <p className="font-body text-sm text-red-700" role="alert">
          {serverError}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-body text-sm font-semibold text-ink">
            お名前
          </label>
          <input
            id="name"
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`mt-2 min-h-[44px] w-full rounded-sm border-2 bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${fieldErrorClass(!!errors.name)}`}
            {...register("name")}
          />
          {errors.name ? (
            <p id="name-error" className="mt-1 font-body text-xs text-red-700">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="partnerName" className="font-body text-sm font-semibold text-ink">
            お相手のお名前（任意）
          </label>
          <input
            id="partnerName"
            autoComplete="name"
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            {...register("partnerName")}
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
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`mt-2 min-h-[44px] w-full rounded-sm border-2 bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${fieldErrorClass(!!errors.email)}`}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="mt-1 font-body text-xs text-red-700">
              {errors.email.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="phone" className="font-body text-sm font-semibold text-ink">
            電話番号（テキスト / WhatsApp推奨）
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={`mt-2 min-h-[44px] w-full rounded-sm border-2 bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${fieldErrorClass(!!errors.phone)}`}
            {...register("phone")}
          />
          {errors.phone ? (
            <p id="phone-error" className="mt-1 font-body text-xs text-red-700">
              {errors.phone.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label htmlFor="weddingDateFirst" className="font-body text-sm font-semibold text-ink">
            希望日（第1候補）
          </label>
          <input
            id="weddingDateFirst"
            type="date"
            aria-invalid={errors.weddingDateFirst ? true : undefined}
            aria-describedby={errors.weddingDateFirst ? "weddingDateFirst-error" : undefined}
            className={`mt-2 min-h-[44px] w-full rounded-sm border-2 bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${fieldErrorClass(!!errors.weddingDateFirst)}`}
            {...register("weddingDateFirst")}
          />
          {errors.weddingDateFirst ? (
            <p id="weddingDateFirst-error" className="mt-1 font-body text-xs text-red-700">
              {errors.weddingDateFirst.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="weddingDateSecond" className="font-body text-sm font-semibold text-ink">
            希望日（第2候補）
          </label>
          <input
            id="weddingDateSecond"
            type="date"
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            {...register("weddingDateSecond")}
          />
        </div>
        <div>
          <label htmlFor="weddingDateThird" className="font-body text-sm font-semibold text-ink">
            希望日（第3候補）
          </label>
          <input
            id="weddingDateThird"
            type="date"
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            {...register("weddingDateThird")}
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
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            {...register("venue")}
          />
        </div>
        <div>
          <label htmlFor="guestCount" className="font-body text-sm font-semibold text-ink">
            予定ゲスト人数（任意）
          </label>
          <input
            id="guestCount"
            type="number"
            min={1}
            inputMode="numeric"
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            {...register("guestCount")}
          />
        </div>
        <div>
          <label htmlFor="budget" className="font-body text-sm font-semibold text-ink">
            ご予算（任意）
          </label>
          <input
            id="budget"
            placeholder="例: 15万円前後"
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            {...register("budget")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="font-body text-sm font-semibold text-ink">
          ご相談内容（希望パッケージ・参考URL・質問など）
        </label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`mt-2 w-full rounded-sm border-2 bg-canvas px-3 py-2 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${fieldErrorClass(!!errors.message)}`}
          {...register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="mt-1 font-body text-xs text-red-700">
            {errors.message.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="font-display inline-flex min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "送信中…" : "送信する"}
        </button>
      </div>
    </form>
  );
}
