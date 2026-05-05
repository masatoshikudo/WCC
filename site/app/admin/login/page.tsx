"use client";

import { useFormState, useFormStatus } from "react-dom";

import { adminLoginAction, type AdminLoginState } from "@/app/admin/actions";

const initial: AdminLoginState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="font-display min-h-[44px] w-full rounded-full bg-accent px-6 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:opacity-80 disabled:opacity-60"
    >
      {pending ? "送信中…" : "ログイン"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(adminLoginAction, initial);

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-xl font-bold text-ink">予約データ（管理）</h1>
      <p className="mt-2 font-body text-sm text-ink-muted">パスワードは環境変数 ADMIN_BOOKINGS_PASSWORD で設定します。</p>
      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label htmlFor="admin-password" className="font-body text-sm font-semibold text-ink">
            パスワード
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 min-h-[44px] w-full rounded-sm border-2 border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        {state?.message ? (
          <p className="font-body text-sm text-red-700" role="alert">
            {state.message}
          </p>
        ) : null}
        <SubmitButton />
      </form>
    </div>
  );
}
