import Link from "next/link";

import { adminLogoutAction, upsertBookingQuoteReferenceAction } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin-auth-server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

type IntentRow = {
  attempt_id: string;
  created_at: string;
  email: string;
  booker_name: string | null;
  wedding_date: string;
  date_undecided: boolean;
  venue_name: string | null;
  venue_area: string | null;
  start_time: string | null;
  start_time_undecided: boolean;
  coverage_scope: "ceremony_only" | "ceremony_reception" | "through_afterparty" | null;
  couple_name: string | null;
  timeline_note: string | null;
  requested_scenes: string | null;
  delivery_channels: string[] | null;
  reference_video_urls: string[] | null;
  venue_restrictions: string | null;
  emergency_contact: string | null;
  plan_id: string;
  plan_label: string;
  price_label: string;
};

type QuoteStatus = "draft" | "sent" | "approved" | "paid" | "expired" | "cancelled";

type QuoteRow = {
  id: number;
  attempt_id: string;
  created_at: string;
  updated_at: string;
  status: QuoteStatus;
  base_price_ex_tax: number | string;
  option_fee_ex_tax: number | string;
  travel_fee_ex_tax: number | string;
  lodging_fee_ex_tax: number | string;
  discount_ex_tax: number | string;
  subtotal_ex_tax: number | string;
  tax_amount: number | string;
  total_in_tax: number | string;
  stripe_customer_id: string | null;
  stripe_quote_id: string | null;
  stripe_invoice_id: string | null;
  payment_url: string | null;
  expires_at: string | null;
  sent_at: string | null;
  paid_at: string | null;
};

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("ja-JP");
}

function formatYen(value: number | string): string {
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return "—";
  return `${parsed.toLocaleString("ja-JP")}円`;
}

function getQuoteStatusLabel(status: QuoteStatus): string {
  switch (status) {
    case "draft":
      return "下書き";
    case "sent":
      return "送付済み";
    case "approved":
      return "承認";
    case "paid":
      return "支払済み";
    case "expired":
      return "期限切れ";
    case "cancelled":
      return "キャンセル";
  }
}

function formatDateInputValue(value: string | null): string {
  if (!value) return "";
  return value.slice(0, 10);
}

function formatCoverageScope(value: IntentRow["coverage_scope"]): string {
  switch (value) {
    case "ceremony_only":
      return "挙式のみ";
    case "ceremony_reception":
      return "挙式 + 披露宴まで";
    case "through_afterparty":
      return "二次会まで";
    default:
      return "—";
  }
}

function formatStringArray(value: string[] | null): string {
  if (!value?.length) return "—";
  return value.join(" / ");
}

function stripeDashboardUrl(
  type: "customers" | "quotes" | "invoices",
  id: string | null,
): string | null {
  if (!id) return null;
  return `https://dashboard.stripe.com/${type}/${id}`;
}

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

  const { data: quotesRaw } = await supabase
    .from("booking_quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(400);

  const intents = (intentsRaw ?? []) as IntentRow[];
  const quotes = (quotesRaw ?? []) as QuoteRow[];
  const quoteByAttemptId = new Map<string, QuoteRow>(
    quotes.map((row) => [row.attempt_id, row]),
  );

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
          <h1 className="font-display text-xl font-bold text-ink">予約補助ビュー（Stripe連携）</h1>
          <p className="mt-1 font-body text-sm text-ink-muted">
            主運用は Stripe Dashboard。ここでは相談情報と Stripe 参照ID の紐付けを管理します。
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
        <p className="mt-6 rounded-sm border border-hairline bg-canvas p-3 font-body text-sm text-ink-muted">
          同一メールアドレスが複数行ある場合：
          <span className="text-ink">{duplicateEmails.join("、")}</span>
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">相談一覧（intent + quote参照）</h2>
        <div className="mt-3 overflow-x-auto border border-hairline">
          <table className="min-w-[2360px] w-full border-collapse font-body text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-canvas">
                <th className="p-2 font-semibold">日時</th>
                <th className="p-2 font-semibold">メール</th>
                <th className="p-2 font-semibold">挙式日</th>
                <th className="p-2 font-semibold">式場名</th>
                <th className="p-2 font-semibold">エリア</th>
                <th className="p-2 font-semibold">開始時刻</th>
                <th className="p-2 font-semibold">撮影範囲</th>
                <th className="p-2 font-semibold">新郎新婦名</th>
                <th className="p-2 font-semibold">希望媒体</th>
                <th className="p-2 font-semibold">参考動画URL</th>
                <th className="p-2 font-semibold">タイムライン</th>
                <th className="p-2 font-semibold">希望シーン</th>
                <th className="p-2 font-semibold">撮影制限</th>
                <th className="p-2 font-semibold">緊急連絡先</th>
                <th className="p-2 font-semibold">プラン</th>
                <th className="p-2 font-semibold">Stripe顧客</th>
                <th className="p-2 font-semibold">Stripe Quote</th>
                <th className="p-2 font-semibold">Stripe Invoice</th>
                <th className="p-2 font-semibold">Payment URL</th>
                <th className="p-2 font-semibold">ステータス</th>
                <th className="p-2 font-semibold">総額（税込）</th>
                <th className="p-2 font-semibold">有効期限</th>
                <th className="p-2 font-semibold">attempt_id</th>
              </tr>
            </thead>
            <tbody>
              {intents.length === 0 ? (
                <tr>
                  <td colSpan={23} className="p-4 text-ink-muted">
                    データがありません。SQL を Supabase で実行済みか確認してください。
                  </td>
                </tr>
              ) : (
                intents.map((row) => {
                  const quote = quoteByAttemptId.get(row.attempt_id);
                  return (
                    <tr key={row.attempt_id} className="border-b border-hairline">
                      <td className="p-2 align-top whitespace-nowrap text-ink-muted">
                        {new Date(row.created_at).toLocaleString("ja-JP")}
                      </td>
                      <td className="p-2 align-top break-all">{row.email}</td>
                      <td className="p-2 align-top whitespace-nowrap">
                        {row.date_undecided ? "未定" : row.wedding_date || "—"}
                      </td>
                      <td className="p-2 align-top">{row.venue_name || "—"}</td>
                      <td className="p-2 align-top">{row.venue_area || "—"}</td>
                      <td className="p-2 align-top whitespace-nowrap">
                        {row.start_time_undecided ? "未定" : row.start_time || "—"}
                      </td>
                      <td className="p-2 align-top whitespace-nowrap">{formatCoverageScope(row.coverage_scope)}</td>
                      <td className="p-2 align-top">{row.couple_name || "—"}</td>
                      <td className="p-2 align-top">{formatStringArray(row.delivery_channels)}</td>
                      <td className="p-2 align-top break-all">{formatStringArray(row.reference_video_urls)}</td>
                      <td className="p-2 align-top">{row.timeline_note || "—"}</td>
                      <td className="p-2 align-top">{row.requested_scenes || "—"}</td>
                      <td className="p-2 align-top">{row.venue_restrictions || "—"}</td>
                      <td className="p-2 align-top">{row.emergency_contact || "—"}</td>
                      <td className="p-2 align-top">{row.plan_label}</td>
                      <td className="p-2 align-top break-all font-mono text-xs">
                        {quote?.stripe_customer_id ?? "—"}
                      </td>
                      <td className="p-2 align-top break-all font-mono text-xs">
                        {quote?.stripe_quote_id ?? "—"}
                      </td>
                      <td className="p-2 align-top break-all font-mono text-xs">
                        {quote?.stripe_invoice_id ?? "—"}
                      </td>
                      <td className="p-2 align-top break-all font-mono text-xs">
                        {quote?.payment_url ?? "—"}
                      </td>
                      <td className="p-2 align-top whitespace-nowrap">
                        {quote ? getQuoteStatusLabel(quote.status) : "—"}
                      </td>
                      <td className="p-2 align-top whitespace-nowrap">
                        {quote ? formatYen(quote.total_in_tax) : "—"}
                      </td>
                      <td className="p-2 align-top whitespace-nowrap text-ink-muted">
                        {quote ? formatDateTime(quote.expires_at) : "—"}
                      </td>
                      <td className="p-2 align-top break-all font-mono text-xs text-ink-muted">
                        {row.attempt_id}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg font-semibold text-ink">Stripe参照情報の登録・更新</h2>
        <p className="mt-2 font-body text-sm text-ink-muted">
          Stripe Dashboard の情報をここに紐付けると、案件単位で `quote / invoice` を追跡できます。
        </p>
        <div className="mt-3 overflow-x-auto border border-hairline">
          <table className="min-w-[1800px] w-full border-collapse font-body text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-canvas">
                <th className="p-2 font-semibold">attempt_id</th>
                <th className="p-2 font-semibold">顧客</th>
                <th className="p-2 font-semibold">Quote</th>
                <th className="p-2 font-semibold">Invoice</th>
                <th className="p-2 font-semibold">Payment URL</th>
                <th className="p-2 font-semibold">ステータス</th>
                <th className="p-2 font-semibold">基本</th>
                <th className="p-2 font-semibold">オプション</th>
                <th className="p-2 font-semibold">交通費</th>
                <th className="p-2 font-semibold">宿泊費</th>
                <th className="p-2 font-semibold">値引き</th>
                <th className="p-2 font-semibold">小計（税抜）</th>
                <th className="p-2 font-semibold">税額</th>
                <th className="p-2 font-semibold">総額（税込）</th>
                <th className="p-2 font-semibold">有効期限</th>
                <th className="p-2 font-semibold">Dashboard</th>
                <th className="p-2 font-semibold">更新</th>
              </tr>
            </thead>
            <tbody>
              {intents.length === 0 ? (
                <tr>
                  <td colSpan={15} className="p-4 text-ink-muted">
                    データがありません。
                  </td>
                </tr>
              ) : (
                intents.map((intent) => {
                  const row = quoteByAttemptId.get(intent.attempt_id);
                  const customerLink = stripeDashboardUrl("customers", row?.stripe_customer_id ?? null);
                  const quoteLink = stripeDashboardUrl("quotes", row?.stripe_quote_id ?? null);
                  const invoiceLink = stripeDashboardUrl("invoices", row?.stripe_invoice_id ?? null);
                  return (
                    <tr key={`quote-editor-${intent.attempt_id}`} className="border-b border-hairline align-top">
                      <td className="p-2 break-all font-mono text-xs text-ink-muted">{intent.attempt_id}</td>
                      <td className="p-2">
                        <input
                          name="stripe_customer_id"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.stripe_customer_id ?? ""}
                          placeholder="cus_..."
                          className="w-[140px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          name="stripe_quote_id"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.stripe_quote_id ?? ""}
                          placeholder="qt_..."
                          className="w-[140px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          name="stripe_invoice_id"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.stripe_invoice_id ?? ""}
                          placeholder="in_..."
                          className="w-[140px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          name="payment_url"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.payment_url ?? ""}
                          placeholder="https://..."
                          className="w-[220px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          name="status"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.status ?? "draft"}
                          className="w-[112px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        >
                          <option value="draft">下書き</option>
                          <option value="sent">送付済み</option>
                          <option value="approved">承認</option>
                          <option value="paid">支払済み</option>
                          <option value="expired">期限切れ</option>
                          <option value="cancelled">キャンセル</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          name="base_price_ex_tax"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.base_price_ex_tax ?? 0}
                          className="w-[96px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          name="option_fee_ex_tax"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.option_fee_ex_tax ?? 0}
                          className="w-[96px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          name="travel_fee_ex_tax"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.travel_fee_ex_tax ?? 0}
                          className="w-[96px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          name="lodging_fee_ex_tax"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.lodging_fee_ex_tax ?? 0}
                          className="w-[96px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          name="discount_ex_tax"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.discount_ex_tax ?? 0}
                          className="w-[96px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          name="subtotal_ex_tax"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.subtotal_ex_tax ?? 0}
                          className="w-[96px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          name="tax_amount"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.tax_amount ?? 0}
                          className="w-[88px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          name="total_in_tax"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={row?.total_in_tax ?? 0}
                          className="w-[100px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          name="expires_at"
                          form={`quote-form-${intent.attempt_id}`}
                          defaultValue={formatDateInputValue(row?.expires_at ?? null)}
                          className="w-[126px] rounded-sm border border-hairline bg-canvas px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="p-2 text-xs">
                        <div className="flex flex-col gap-1">
                          {customerLink ? <a href={customerLink} className="underline underline-offset-2" target="_blank" rel="noreferrer">顧客</a> : <span className="text-ink-subtle">顧客</span>}
                          {quoteLink ? <a href={quoteLink} className="underline underline-offset-2" target="_blank" rel="noreferrer">Quote</a> : <span className="text-ink-subtle">Quote</span>}
                          {invoiceLink ? <a href={invoiceLink} className="underline underline-offset-2" target="_blank" rel="noreferrer">Invoice</a> : <span className="text-ink-subtle">Invoice</span>}
                        </div>
                      </td>
                      <td className="p-2">
                        <form id={`quote-form-${intent.attempt_id}`} action={upsertBookingQuoteReferenceAction} className="inline">
                          <input type="hidden" name="attempt_id" value={intent.attempt_id} />
                          <button
                            type="submit"
                            className="rounded-sm bg-accent px-3 py-1 text-xs font-semibold text-on-accent hover:opacity-80"
                          >
                            保存
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })
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
