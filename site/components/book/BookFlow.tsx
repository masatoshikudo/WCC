"use client";

import { useEffect, useState } from "react";

import { BookMobileStickyDock } from "@/components/layout/MobileStickyDock";
import { SideColumnVisualPanel } from "@/components/layout/SideColumnVisualPanel";
import { TwoColumnCtaSection } from "@/components/layout/TwoColumnCtaSection";
import { recordBookingIntent } from "@/app/actions/booking";
import { WCC_BOOKING_PLANS, WCC_STANDARD_PACKAGE_DISCLAIMER } from "@/lib/plans";
import { emailFieldSchema } from "@/lib/validations/email";

function newBookingAttemptId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const BOOK_PLAN = WCC_BOOKING_PLANS[0];
const BOOK_PLAN_ID = BOOK_PLAN.id;
const COVERAGE_SCOPE_OPTIONS = [
  { value: "ceremony_only", label: "挙式のみ" },
  { value: "ceremony_reception", label: "挙式 + 披露宴まで" },
  { value: "through_afterparty", label: "二次会まで" },
] as const;
const DELIVERY_CHANNEL_OPTIONS = [
  { value: "instagram_reels", label: "Instagram Reels" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube_shorts", label: "YouTube Shorts" },
  { value: "private_share", label: "個人共有" },
] as const;
type CoverageScope = (typeof COVERAGE_SCOPE_OPTIONS)[number]["value"];
type DeliveryChannel = (typeof DELIVERY_CHANNEL_OPTIONS)[number]["value"];

export function BookFlow() {
  const [step, setStep] = useState<1 | 3>(1);
  const [weddingDate, setWeddingDate] = useState("");
  const [dateUndecided, setDateUndecided] = useState(false);
  const [venueName, setVenueName] = useState("");
  const [venueArea, setVenueArea] = useState("");
  const [startTime, setStartTime] = useState("");
  const [startTimeUndecided, setStartTimeUndecided] = useState(false);
  const [coverageScope, setCoverageScope] = useState<CoverageScope | "">("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [partner1FirstName, setPartner1FirstName] = useState("");
  const [partner1LastName, setPartner1LastName] = useState("");
  const [partner2FirstName, setPartner2FirstName] = useState("");
  const [partner2LastName, setPartner2LastName] = useState("");
  const [timelineNote, setTimelineNote] = useState("");
  const [requestedScenes, setRequestedScenes] = useState("");
  const [deliveryChannels, setDeliveryChannels] = useState<DeliveryChannel[]>([]);
  const [referenceVideoUrlsText, setReferenceVideoUrlsText] = useState("");
  const [venueRestrictions, setVenueRestrictions] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [bookerEmailError, setBookerEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** ステップ3で発行。相談受付（intent）の突合に利用 */
  const [bookingAttemptId, setBookingAttemptId] = useState<string | null>(null);

  const dateLabel = dateUndecided
    ? "未定"
    : weddingDate || "未入力";
  const startTimeLabel = startTimeUndecided ? "未定" : startTime || "未入力";
  const coverageScopeLabel =
    COVERAGE_SCOPE_OPTIONS.find((option) => option.value === coverageScope)?.label ?? "未入力";
  const referenceVideoUrls = parseReferenceUrls(referenceVideoUrlsText);
  const partner1FullName = `${partner1FirstName.trim()} ${partner1LastName.trim()}`.trim();
  const partner2FullName = `${partner2FirstName.trim()} ${partner2LastName.trim()}`.trim();
  const coupleNameForSubmission = [partner1FullName, partner2FullName].filter(Boolean).join(" / ");
  const deliveryChannelsLabel = deliveryChannels.length
    ? deliveryChannels
        .map((channel) => DELIVERY_CHANNEL_OPTIONS.find((option) => option.value === channel)?.label ?? channel)
        .join(" / ")
    : "未入力";
  const stepPrimaryLabel =
    step === 1 ? "次へ：送信内容を確認" : "相談内容を送信";

  useEffect(() => {
    if (step !== 3) {
      setBookingAttemptId(null);
      return;
    }
    setBookingAttemptId((k) => k ?? newBookingAttemptId());
  }, [step]);

  function parseReferenceUrls(text: string): string[] {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  function toggleDeliveryChannel(channel: DeliveryChannel) {
    setDeliveryChannels((prev) =>
      prev.includes(channel) ? prev.filter((v) => v !== channel) : [...prev, channel],
    );
  }

  function goToStep3() {
    setFormError(null);
    const parsed = emailFieldSchema.safeParse(bookerEmail.trim());
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "入力内容を確認してください";
      setBookerEmailError(msg);
      return;
    }
    if (!dateUndecided && !weddingDate) {
      setFormError("挙式日を入力してください（未定の場合はチェックを付けてください）。");
      return;
    }
    if (!venueName.trim()) {
      setFormError("式場名を入力してください。");
      return;
    }
    if (!venueArea.trim()) {
      setFormError("開催エリアを入力してください。");
      return;
    }
    if (!startTimeUndecided && !startTime) {
      setFormError("開始時刻を入力してください（未定の場合はチェックを付けてください）。");
      return;
    }
    if (!coverageScope) {
      setFormError("撮影範囲を選択してください。");
      return;
    }
    if (
      !partner1FirstName.trim() ||
      !partner1LastName.trim() ||
      !partner2FirstName.trim() ||
      !partner2LastName.trim()
    ) {
      setFormError("おふたりのお名前（姓・名）を入力してください。");
      return;
    }
    if (!emergencyContact.trim()) {
      setFormError("電話番号を入力してください。");
      return;
    }
    const urls = parseReferenceUrls(referenceVideoUrlsText);
    const hasInvalidUrl = urls.some((url) => {
      try {
        // URL 形式の最低限チェック
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });
    if (hasInvalidUrl) {
      setFormError("参考動画URLは 1 行につき 1 つの正しいURLを入力してください。");
      return;
    }
    setBookerEmailError(null);
    setFormError(null);
    setStep(3);
  }

  async function submitBookingRequest() {
    if (submitState === "submitting" || submitState === "success") return;
    setSubmitError(null);
    setSubmitState("submitting");
    const attemptId = bookingAttemptId ?? newBookingAttemptId();
    if (!bookingAttemptId) {
      setBookingAttemptId(attemptId);
    }
    try {
      await recordBookingIntent({
        attemptId,
        email: bookerEmail.trim(),
        bookerName: null,
        weddingDate,
        dateUndecided,
        venueName: venueName.trim(),
        venueArea: venueArea.trim(),
        startTime,
        startTimeUndecided,
        coverageScope: coverageScope as CoverageScope,
        coupleName: coupleNameForSubmission,
        timelineNote: timelineNote.trim() ? timelineNote.trim() : null,
        requestedScenes: requestedScenes.trim() ? requestedScenes.trim() : null,
        deliveryChannels,
        referenceVideoUrls,
        venueRestrictions: venueRestrictions.trim() ? venueRestrictions.trim() : null,
        emergencyContact: emergencyContact.trim() ? emergencyContact.trim() : null,
        planId: BOOK_PLAN_ID,
        planLabel: BOOK_PLAN.label,
        priceLabel: BOOK_PLAN.priceLabel,
      });
      setSubmitState("success");
    } catch {
      setSubmitState("error");
      setSubmitError("送信に失敗しました。時間をおいて再度お試しください。");
    }
  }

  return (
    <div className="mx-auto w-full max-w-content px-4 py-10 md:px-6 md:py-12 lg:min-h-[calc(100svh-6rem)] lg:px-8 lg:py-10">
      <TwoColumnCtaSection
        className="lg:mt-6 lg:items-start"
        leftAside={
          <div className="lg:sticky lg:top-40 lg:self-start">
            <SideColumnVisualPanel />
          </div>
        }
      >
      <div>
        <h1 className="font-display mt-3 text-[1.75rem] font-bold text-ink">日程・内容のご相談</h1>
        <p className="mt-3 max-w-2xl font-body leading-relaxed text-ink-muted">
          1分で送信できます。内容確認後、担当より見積と請求URLをメールでご案内します。
        </p>

        <h2 className="font-display mt-6 text-xl font-bold text-ink">
          {step === 1 ? "日程・連絡先を入力" : "送信内容を確認"}
        </h2>
      </div>

      {step === 1 && (
        <div className="mt-8 max-w-lg space-y-6">
          {formError ? (
            <p role="alert" className="font-body text-sm text-danger">
              {formError}
            </p>
          ) : null}
          <section>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">必須項目</p>
            <div className="mt-4 space-y-5 border-t border-hairline pt-5">
              <div>
                <p className="font-body text-sm font-semibold text-ink">新郎のお名前</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="partner1-first-name" className="font-body text-xs text-ink-muted">
                      名（必須）
                    </label>
                    <input
                      id="partner1-first-name"
                      value={partner1FirstName}
                      onChange={(e) => setPartner1FirstName(e.target.value)}
                      className="mt-1 min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="partner1-last-name" className="font-body text-xs text-ink-muted">
                      姓（必須）
                    </label>
                    <input
                      id="partner1-last-name"
                      value={partner1LastName}
                      onChange={(e) => setPartner1LastName(e.target.value)}
                      className="mt-1 min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="font-body text-sm font-semibold text-ink">新婦のお名前</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="partner2-first-name" className="font-body text-xs text-ink-muted">
                      名（必須）
                    </label>
                    <input
                      id="partner2-first-name"
                      value={partner2FirstName}
                      onChange={(e) => setPartner2FirstName(e.target.value)}
                      className="mt-1 min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="partner2-last-name" className="font-body text-xs text-ink-muted">
                      姓（必須）
                    </label>
                    <input
                      id="partner2-last-name"
                      value={partner2LastName}
                      onChange={(e) => setPartner2LastName(e.target.value)}
                      className="mt-1 min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="booker-email" className="font-body text-sm font-semibold text-ink">
                  メールアドレス
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
                  className={`mt-2 min-h-[44px] w-full rounded-sm border bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${bookerEmailError ? "border-red-600 focus-visible:outline-red-600" : "border-hairline focus-visible:outline-accent"}`}
                />
                {bookerEmailError ? (
                  <p id="booker-email-error" className="mt-1 font-body text-xs text-red-700">
                    {bookerEmailError}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="phone-number" className="font-body text-sm font-semibold text-ink">
                  電話番号
                </label>
                <input
                  id="phone-number"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="当日連絡がつく電話番号"
                  className="mt-2 min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>

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
                    className="min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 sm:max-w-[240px]"
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
                <label htmlFor="venue-name" className="font-body text-sm font-semibold text-ink">
                  式場名
                </label>
                <input
                  id="venue-name"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="mt-2 min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>

              <div>
                <label htmlFor="venue-area" className="font-body text-sm font-semibold text-ink">
                  開催エリア
                </label>
                <input
                  id="venue-area"
                  value={venueArea}
                  onChange={(e) => setVenueArea(e.target.value)}
                  placeholder="東京都港区 など"
                  className="mt-2 min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>

              <div>
                <label htmlFor="start-time" className="font-body text-sm font-semibold text-ink">
                  当日の開始時刻
                </label>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    id="start-time"
                    type="time"
                    disabled={startTimeUndecided}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 sm:max-w-[240px]"
                  />
                  <label className="flex cursor-pointer items-center gap-2 font-body text-sm text-ink-muted">
                    <input
                      type="checkbox"
                      checked={startTimeUndecided}
                      onChange={(e) => {
                        setStartTimeUndecided(e.target.checked);
                        if (e.target.checked) setStartTime("");
                      }}
                      className="h-4 w-4 rounded-sm border-hairline text-accent"
                    />
                    時間は未定
                  </label>
                </div>
              </div>

              <div>
                <p className="font-body text-sm font-semibold text-ink">撮影範囲</p>
                <div className="mt-3 space-y-2">
                  {COVERAGE_SCOPE_OPTIONS.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-2 font-body text-sm text-ink">
                      <input
                        type="radio"
                        name="coverage-scope"
                        value={option.value}
                        checked={coverageScope === option.value}
                        onChange={(e) => setCoverageScope(e.target.value as CoverageScope)}
                        className="h-4 w-4 border-hairline text-accent"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-1 border-t border-hairline pt-6">
            <p className="font-body text-sm font-semibold text-ink">料金の目安</p>
            <p className="font-body text-sm text-ink-muted">基本料金 {BOOK_PLAN.priceLabel}</p>
            <p className="font-body text-xs leading-relaxed text-ink-muted">
              {WCC_STANDARD_PACKAGE_DISCLAIMER}
            </p>
          </section>

          <section>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">任意項目</p>
            <p className="mt-1 font-body text-xs text-ink-muted">
              わかる範囲でご入力ください。
            </p>
            <div className="mt-4 space-y-5 border-t border-hairline pt-5">
              <div>
                <label htmlFor="timeline-note" className="font-body text-sm font-semibold text-ink">
                  集合〜お開きの想定タイムライン
                </label>
                <textarea
                  id="timeline-note"
                  value={timelineNote}
                  onChange={(e) => setTimelineNote(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-sm border border-hairline bg-canvas px-3 py-2 font-body text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>

              <div>
                <label htmlFor="requested-scenes" className="font-body text-sm font-semibold text-ink">
                  撮ってほしいシーン
                </label>
                <textarea
                  id="requested-scenes"
                  value={requestedScenes}
                  onChange={(e) => setRequestedScenes(e.target.value)}
                  rows={3}
                  placeholder="例: 家族とのカット、手紙、ファーストミート"
                  className="mt-2 w-full rounded-sm border border-hairline bg-canvas px-3 py-2 font-body text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>

              <div>
                <p className="font-body text-sm font-semibold text-ink">使用予定媒体（複数選択可）</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {DELIVERY_CHANNEL_OPTIONS.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-center gap-2 font-body text-sm text-ink">
                      <input
                        type="checkbox"
                        checked={deliveryChannels.includes(option.value)}
                        onChange={() => toggleDeliveryChannel(option.value)}
                        className="h-4 w-4 rounded-sm border-hairline text-accent"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="reference-video-urls" className="font-body text-sm font-semibold text-ink">
                  参考動画URL（1行1URL）
                </label>
                <textarea
                  id="reference-video-urls"
                  value={referenceVideoUrlsText}
                  onChange={(e) => setReferenceVideoUrlsText(e.target.value)}
                  rows={3}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-sm border border-hairline bg-canvas px-3 py-2 font-body text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>

              <div>
                <label htmlFor="venue-restrictions" className="font-body text-sm font-semibold text-ink">
                  会場側の撮影制限情報
                </label>
                <textarea
                  id="venue-restrictions"
                  value={venueRestrictions}
                  onChange={(e) => setVenueRestrictions(e.target.value)}
                  rows={2}
                  className="mt-2 w-full rounded-sm border border-hairline bg-canvas px-3 py-2 font-body text-sm text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>

              <div>
                <label htmlFor="emergency-contact" className="font-body text-sm font-semibold text-ink">
                  緊急連絡先
                </label>
                <input
                  id="emergency-contact"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="当日連絡がつく電話番号"
                  className="mt-2 min-h-[44px] w-full rounded-sm border border-hairline bg-canvas px-3 font-body text-ink outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                />
              </div>
            </div>
          </section>

          <div className="pt-4">
            <button
              type="button"
              onClick={goToStep3}
              className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover md:inline-flex"
            >
              次へ：送信内容を確認
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-8 max-w-prose space-y-6">
          <section>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">必須項目</p>
            <dl className="mt-4 space-y-3 border-t border-hairline pt-5 font-body text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">連絡先メール</dt>
                <dd className="break-all text-right text-ink">{bookerEmail.trim()}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">電話番号</dt>
                <dd className="text-right text-ink">{emergencyContact.trim() || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">挙式日</dt>
                <dd className="text-right text-ink">{dateLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">新郎</dt>
                <dd className="text-right text-ink">{partner1FullName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">新婦</dt>
                <dd className="text-right text-ink">{partner2FullName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">式場名</dt>
                <dd className="text-right text-ink">{venueName.trim() || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">開催エリア</dt>
                <dd className="text-right text-ink">{venueArea.trim() || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">開始時刻</dt>
                <dd className="text-right text-ink">{startTimeLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">撮影範囲</dt>
                <dd className="text-right text-ink">{coverageScopeLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">料金目安</dt>
                <dd className="text-right text-ink">{BOOK_PLAN.priceLabel}</dd>
              </div>
            </dl>
          </section>

          <section>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">任意項目</p>
            <dl className="mt-4 space-y-3 border-t border-hairline pt-5 font-body text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">使用予定媒体</dt>
                <dd className="text-right text-ink">{deliveryChannelsLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">参考動画URL</dt>
                <dd className="max-w-[60%] text-right text-ink">
                  {referenceVideoUrls.length ? referenceVideoUrls.join(" / ") : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">想定タイムライン</dt>
                <dd className="max-w-[60%] text-right text-ink">{timelineNote.trim() || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">希望シーン</dt>
                <dd className="max-w-[60%] text-right text-ink">{requestedScenes.trim() || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">撮影制限情報</dt>
                <dd className="max-w-[60%] text-right text-ink">{venueRestrictions.trim() || "—"}</dd>
              </div>
            </dl>
          </section>

          <p className="font-body text-sm leading-relaxed text-ink-muted">
            送信後、担当より見積と請求URLをメールでお送りします。48時間以内の納品条件を前提に、当日の進行に合わせて最終調整します。
          </p>

          {submitState === "success" ? (
            <div role="status" className="rounded-sm border border-hairline bg-canvas-subtle p-4">
              <p className="font-body text-sm text-success">ご相談内容を受け付けました。</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">
                通常24時間以内を目安に、見積のご案内メールをお送りします。
              </p>
            </div>
          ) : null}

          {submitError ? (
            <p role="alert" className="font-body text-sm text-danger">
              {submitError}
            </p>
          ) : null}

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
              disabled={submitState === "submitting" || submitState === "success"}
              onClick={() => {
                void submitBookingRequest();
              }}
              className="font-display hidden min-h-[52px] min-w-[220px] items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold uppercase tracking-[0.08em] text-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-ink-subtle disabled:text-canvas disabled:opacity-80 md:inline-flex"
            >
              {submitState === "submitting" ? "送信中…" : submitState === "success" ? "送信済み" : "相談内容を送信"}
            </button>
          </div>
        </div>
      )}
      </TwoColumnCtaSection>

      <BookMobileStickyDock
        step={step}
        stepPrimaryLabel={stepPrimaryLabel}
        onStep1Next={goToStep3}
        onStep3Submit={() => {
          void submitBookingRequest();
        }}
        isStep3Submitting={submitState === "submitting"}
        isStep3Done={submitState === "success"}
      />
    </div>
  );
}
