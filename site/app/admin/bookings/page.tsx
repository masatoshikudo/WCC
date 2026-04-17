import Link from "next/link";

import { adminLogoutAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin-auth-server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

type IntentRow = {
  attempt_id: string;
  created_at: string;
  email: string;
  booker_name: string | null;
  wedding_date: string;
  date_undecided: boolean;
  plan_id: string;
  plan_label: string;
  price_label: string;
};

type PaymentRow = {
  attempt_id: string;
  created_at: string;
  email: string;
  booker_name: string | null;
  wedding_date: string;
  date_undecided: boolean;
  plan_id: string;
  plan_label: string;
  price_label: string;
  stripe_checkout_session_id: string | null;
  source: string;
};

export default async function AdminBookingsPage() {
  await requireAdminSession();

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-content px-4 py-10">
        <p className="font-body text-ink-muted">Supabase が未設定です（NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY）。</p>
      </div>
    );
  }

  const { data: intentsRaw } = await supabase
    .from("booking_intents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(400);

  const { data: paymentsRaw } = await supabase
    .from("booking_payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(400);

  const intents = (intentsRaw ?? []) as IntentRow[];
  const payments = (paymentsRaw ?? []) as PaymentRow[];

  const emailCounts = new Map<string, number>();
  for (const row of intents) {
    const e = row.email.toLowerCase();
    emailCounts.set(e, (emailCounts.get(e) ?? 0) + 1);
  }
  const duplicateEmails = Array.from(emailCounts.entries())
    .filter(([, n]) => n > 1)
    .map(([e]) => e);

  return (
    <div className="mx-auto max-w-content px-4 py-8 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-ink">予約・決済（一覧）</h1>
          <p className="mt-1 font-body text-sm text-ink-muted">
            booking_intents＝お支払い前の確定、booking_payments＝決済完了後。
          </p>
        </div>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="font-body text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
          >
            ログアウト
          </button>
        </form>
      </div>

      {duplicateEmails.length > 0 ? (
        <p className="mt-6 rounded-sm border border-hairline bg-canvas-subtle p-3 font-body text-sm text-ink-muted">
          同一メールアドレスが複数行ある場合：
          <span className="text-ink">{duplicateEmails.join("、")}</span>
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">お支払い前（intent）</h2>
        <div className="mt-3 overflow-x-auto border border-hairline">
          <table className="min-w-[720px] w-full border-collapse font-body text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-canvas-subtle">
                <th className="p-2 font-semibold">日時</th>
                <th className="p-2 font-semibold">メール</th>
                <th className="p-2 font-semibold">挙式日</th>
                <th className="p-2 font-semibold">プラン</th>
                <th className="p-2 font-semibold">attempt_id</th>
              </tr>
            </thead>
            <tbody>
              {intents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-ink-muted">
                    データがありません。SQL を Supabase で実行済みか確認してください。
                  </td>
                </tr>
              ) : (
                intents.map((row) => (
                  <tr key={row.attempt_id} className="border-b border-hairline">
                    <td className="p-2 align-top whitespace-nowrap text-ink-muted">
                      {new Date(row.created_at).toLocaleString("ja-JP")}
                    </td>
                    <td className="p-2 align-top break-all">{row.email}</td>
                    <td className="p-2 align-top whitespace-nowrap">
                      {row.date_undecided ? "未定" : row.wedding_date || "—"}
                    </td>
                    <td className="p-2 align-top">{row.plan_label}</td>
                    <td className="p-2 align-top break-all font-mono text-xs text-ink-muted">{row.attempt_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold text-ink">決済完了（payment）</h2>
        <div className="mt-3 overflow-x-auto border border-hairline">
          <table className="min-w-[960px] w-full border-collapse font-body text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-canvas-subtle">
                <th className="p-2 font-semibold">日時</th>
                <th className="p-2 font-semibold">メール</th>
                <th className="p-2 font-semibold">挙式日</th>
                <th className="p-2 font-semibold">プラン</th>
                <th className="p-2 font-semibold">Stripe session</th>
                <th className="p-2 font-semibold">attempt_id</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-ink-muted">
                    データがありません。
                  </td>
                </tr>
              ) : (
                payments.map((row) => (
                  <tr key={row.attempt_id} className="border-b border-hairline">
                    <td className="p-2 align-top whitespace-nowrap text-ink-muted">
                      {new Date(row.created_at).toLocaleString("ja-JP")}
                    </td>
                    <td className="p-2 align-top break-all">{row.email}</td>
                    <td className="p-2 align-top whitespace-nowrap">
                      {row.date_undecided ? "未定" : row.wedding_date || "—"}
                    </td>
                    <td className="p-2 align-top">{row.plan_label}</td>
                    <td className="p-2 align-top break-all font-mono text-xs">
                      {row.stripe_checkout_session_id ?? "—"}
                    </td>
                    <td className="p-2 align-top break-all font-mono text-xs text-ink-muted">{row.attempt_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-10 font-body text-xs text-ink-muted">
        <Link href="/" className="underline underline-offset-4 hover:opacity-80">
          サイトへ戻る
        </Link>
      </p>
    </div>
  );
}
