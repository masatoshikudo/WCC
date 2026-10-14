"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePostHog } from "posthog-js/react";

import { recordBookingIntent } from "@/app/actions/booking";
import { fetchReceptionAvailability } from "@/app/actions/reception";
import { BookingIntentError } from "@/lib/booking-errors";
import {
  COUPON_CODE_MAX_LENGTH,
  COUPON_QUERY_PARAM,
  WEDDING_TODO_COUPON,
  normalizeCouponCode,
} from "@/lib/coupon";
import { WCC_BOOKING_PLANS, WCC_STANDARD_PACKAGE_DISCLAIMER } from "@/lib/plans";
import {
  CAPACITY_PER_MONTH,
  type MonthAvailability,
  type PreferredWeddingMonth,
  formatPreferredMonthLabelLong,
  formatWeddingScheduleLabel,
  getCapacityErrorMessage,
  getDatePickerBounds,
  getSelectableWeddingMonths,
  validateWeddingScheduling,
} from "@/lib/reception";
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
  { value: "ceremony_only", label: "挙式のみ", span: 1 },
  { value: "ceremony_reception", label: "挙式 + 披露宴まで", span: 2 },
  { value: "through_afterparty", label: "二次会まで", span: 3 },
] as const;
/** 撮影範囲の目盛りに並べる場面 */
const COVERAGE_STAGES = ["挙式", "披露宴", "二次会"] as const;
const DELIVERY_CHANNEL_OPTIONS = [
  { value: "instagram_reels", label: "Instagram Reels" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube_shorts", label: "YouTube Shorts" },
  { value: "private_share", label: "個人共有" },
] as const;
type CoverageScope = (typeof COVERAGE_SCOPE_OPTIONS)[number]["value"];
type DeliveryChannel = (typeof DELIVERY_CHANNEL_OPTIONS)[number]["value"];

export function BookFlow() {
  const posthog = usePostHog();
  const [step, setStep] = useState<1 | 3>(1);
  const [weddingDate, setWeddingDate] = useState("");
  const [dateUndecided, setDateUndecided] = useState(false);
  const [preferredWeddingMonth, setPreferredWeddingMonth] = useState<PreferredWeddingMonth | "">("");
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailability[]>([]);
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
  const [extrasNote, setExtrasNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [bookerEmailError, setBookerEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** ステップ3で発行。相談受付（intent）の突合に利用 */
  const [bookingAttemptId, setBookingAttemptId] = useState<string | null>(null);

  const dateLabel = formatWeddingScheduleLabel({
    dateUndecided,
    weddingDate,
    preferredWeddingMonth: preferredWeddingMonth || null,
  });
  const startTimeLabel = startTimeUndecided ? "未定" : startTime || "未入力";
  const coverageScopeLabel =
    COVERAGE_SCOPE_OPTIONS.find((option) => option.value === coverageScope)?.label ?? "未入力";
  const referenceVideoUrls = parseReferenceUrls(referenceVideoUrlsText);
  // 姓 → 名 の順（入力欄も姓が先）
  const partner1FullName = `${partner1LastName.trim()} ${partner1FirstName.trim()}`.trim();
  const partner2FullName = `${partner2LastName.trim()} ${partner2FirstName.trim()}`.trim();
  const coupleNameForSubmission = [partner1FullName, partner2FullName].filter(Boolean).join(" / ");
  const deliveryChannelsLabel = deliveryChannels.length
    ? deliveryChannels
        .map((channel) => DELIVERY_CHANNEL_OPTIONS.find((option) => option.value === channel)?.label ?? channel)
        .join(" / ")
    : "未入力";
  const stepPrimaryLabel =
    step === 1 ? "次へ：送信内容を確認" : "相談内容を送信";

  const datePickerBounds = useMemo(() => getDatePickerBounds(), []);
  const selectableMonths = useMemo(() => getSelectableWeddingMonths(), []);

  useEffect(() => {
    void fetchReceptionAvailability().then(setMonthAvailability);
  }, []);

  // Wedding TODO アプリのリンク（/book?coupon=XXXX）から来た人は、コードを最初から入れておく
  useEffect(() => {
    const fromUrl = normalizeCouponCode(
      new URLSearchParams(window.location.search).get(COUPON_QUERY_PARAM),
    );
    if (fromUrl) setCouponCode(fromUrl);
  }, []);
  const couponCodeForSubmission = normalizeCouponCode(couponCode);

  function getAvailabilityForMonth(monthKey: PreferredWeddingMonth): MonthAvailability | undefined {
    return monthAvailability.find((item) => item.monthKey === monthKey);
  }

  function validateSchedulingAndCapacity(): string | null {
    const scheduling = validateWeddingScheduling({
      dateUndecided,
      weddingDate,
      preferredWeddingMonth: preferredWeddingMonth || null,
    });
    if (!scheduling.ok) return scheduling.message;

    const availability = getAvailabilityForMonth(scheduling.monthKey);
    if (availability?.isFull) {
      return getCapacityErrorMessage(scheduling.monthKey);
    }
    return null;
  }

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
    const schedulingError = validateSchedulingAndCapacity();
    if (schedulingError) {
      setFormError(schedulingError);
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
      setFormError("お二人のお名前（姓・名）を入力してください。");
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
        preferredWeddingMonth: dateUndecided ? preferredWeddingMonth || null : null,
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
        extrasNote: extrasNote.trim() ? extrasNote.trim() : null,
        couponCode: couponCodeForSubmission,
        planId: BOOK_PLAN_ID,
        planLabel: BOOK_PLAN.label,
        priceLabel: BOOK_PLAN.priceLabel,
      });
      setSubmitState("success");
      // 成功イベント。個人情報（氏名・メール・緊急連絡先・会場名）は送らない
      posthog?.capture("booking_intent_submitted", {
        plan_id: BOOK_PLAN_ID,
        plan_label: BOOK_PLAN.label,
        coverage_scope: coverageScope,
        date_undecided: dateUndecided,
        preferred_wedding_month: dateUndecided ? preferredWeddingMonth || null : null,
        start_time_undecided: startTimeUndecided,
        delivery_channels: deliveryChannels,
        venue_area: venueArea.trim() || null,
        has_coupon: couponCodeForSubmission !== null,
      });
    } catch (err) {
      setSubmitState("error");
      setSubmitError(
        err instanceof BookingIntentError
          ? err.message
          : "送信に失敗しました。時間をおいて再度お試しください。",
      );
    }
  }

  const isAppCoupon = couponCodeForSubmission === WEDDING_TODO_COUPON.code;
  const stepIndex = submitState === "success" ? 3 : step === 1 ? 1 : 2;

  return (
    <div className="bk">
      <div className="wrap bk-grid">
        {/* 左：縦動画と受付状況（PC のみ） */}
        <aside className="bk-aside" aria-hidden="true">
          <div className="bk-visual">
            <video
              src="/videos/realmoment/realmoment-reception-1.mp4"
              poster="/images/highlight-posters/realmoment-reception-1.jpg"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
            />
            <span className="bk-visual-tag">9:16 MOVIE</span>
          </div>
        </aside>

        <div className="bk-main">
          {/* 進み具合：入力 → 確認 → 完了 */}
          <ol className="bk-steps" aria-label="ご相談の流れ">
            {["入力", "確認", "完了"].map((label, k) => (
              <li
                key={label}
                className={`bk-step${stepIndex === k + 1 ? " now" : ""}${stepIndex > k + 1 ? " done" : ""}`}
                aria-current={stepIndex === k + 1 ? "step" : undefined}
              >
                <span className="bk-step-dot">{stepIndex > k + 1 ? <Check /> : k + 1}</span>
                <span className="bk-step-label">{label}</span>
              </li>
            ))}
          </ol>

          {step === 1 && (
            <div className="bk-form">
              {formError ? (
                <p role="alert" className="bk-alert">
                  <Alert />
                  {formError}
                </p>
              ) : null}

              {/* ふたりのこと */}
              <Card icon={<IconCouple />} title="おふたりのお名前" required>
                <div className="bk-names">
                  <NamePair
                    who="新郎"
                    first={partner1FirstName}
                    last={partner1LastName}
                    onFirst={setPartner1FirstName}
                    onLast={setPartner1LastName}
                    idPrefix="partner1"
                  />
                  <NamePair
                    who="新婦"
                    first={partner2FirstName}
                    last={partner2LastName}
                    onFirst={setPartner2FirstName}
                    onLast={setPartner2LastName}
                    idPrefix="partner2"
                  />
                </div>
              </Card>

              {/* 連絡先 */}
              <Card icon={<IconMail />} title="ご連絡先" required>
                <div className="bk-row2">
                  <Field label="メールアドレス" htmlFor="booker-email" error={bookerEmailError} errorId="booker-email-error">
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
                      className="bk-input"
                      placeholder="name@example.com"
                    />
                  </Field>
                  <Field label="電話番号" htmlFor="phone-number">
                    <input
                      id="phone-number"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="当日連絡がつく電話番号"
                      className="bk-input"
                    />
                  </Field>
                </div>
              </Card>

              {/* 当日のこと */}
              <Card icon={<IconCalendar />} title="挙式のこと" required>
                <Field label="挙式日" htmlFor="wedding-date">
                  <div className="bk-inline">
                    <input
                      id="wedding-date"
                      type="date"
                      disabled={dateUndecided}
                      value={weddingDate}
                      min={datePickerBounds.min}
                      max={datePickerBounds.max}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="bk-input bk-input-short"
                    />
                    <Toggle
                      checked={dateUndecided}
                      onChange={(checked) => {
                        setDateUndecided(checked);
                        if (checked) setWeddingDate("");
                        else setPreferredWeddingMonth("");
                      }}
                      label="日程は未定"
                    />
                  </div>
                </Field>

                {dateUndecided ? (
                  <fieldset className="bk-months">
                    <legend className="bk-label">
                      希望挙式月<span className="bk-req">必須</span>
                    </legend>
                    <div className="bk-month-grid">
                      {selectableMonths.map((monthKey) => {
                        const availability = getAvailabilityForMonth(monthKey);
                        const isFull = availability?.isFull ?? false;
                        const remaining = availability?.remaining ?? CAPACITY_PER_MONTH;
                        const [y, m] = monthKey.split("-");
                        return (
                          <label
                            key={monthKey}
                            className={`bk-month${preferredWeddingMonth === monthKey ? " on" : ""}${isFull ? " full" : ""}`}
                          >
                            <input
                              type="radio"
                              name="preferred-wedding-month"
                              value={monthKey}
                              checked={preferredWeddingMonth === monthKey}
                              disabled={isFull}
                              onChange={() => setPreferredWeddingMonth(monthKey)}
                              aria-label={`${formatPreferredMonthLabelLong(monthKey)}${isFull ? "（満席）" : `（残り${remaining}組）`}`}
                            />
                            <span className="bk-month-y">{y}</span>
                            <span className="bk-month-m">
                              {Number(m)}
                              <small>月</small>
                            </span>
                            {/* 残り枠を丸で表示（塗り＝空き） */}
                            <span className="bk-dots" aria-hidden="true">
                              {Array.from({ length: CAPACITY_PER_MONTH }, (_, k) => (
                                <i key={k} className={k < remaining ? "on" : ""} />
                              ))}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : null}

                <div className="bk-row2">
                  <Field label="式場名" htmlFor="venue-name">
                    <input id="venue-name" value={venueName} onChange={(e) => setVenueName(e.target.value)} className="bk-input" />
                  </Field>
                  <Field label="開催エリア" htmlFor="venue-area">
                    <input
                      id="venue-area"
                      value={venueArea}
                      onChange={(e) => setVenueArea(e.target.value)}
                      placeholder="東京都港区 など"
                      className="bk-input"
                    />
                  </Field>
                </div>

                <Field label="当日の開始時刻" htmlFor="start-time">
                  <div className="bk-inline">
                    <input
                      id="start-time"
                      type="time"
                      disabled={startTimeUndecided}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bk-input bk-input-short"
                    />
                    <Toggle
                      checked={startTimeUndecided}
                      onChange={(checked) => {
                        setStartTimeUndecided(checked);
                        if (checked) setStartTime("");
                      }}
                      label="時間は未定"
                    />
                  </div>
                </Field>

                <fieldset className="bk-cover">
                  <legend className="bk-label">撮影範囲</legend>
                  <div className="bk-cover-grid">
                    {COVERAGE_SCOPE_OPTIONS.map((option) => (
                      <label key={option.value} className={`bk-cover-opt${coverageScope === option.value ? " on" : ""}`}>
                        <input
                          type="radio"
                          name="coverage-scope"
                          value={option.value}
                          checked={coverageScope === option.value}
                          onChange={(e) => setCoverageScope(e.target.value as CoverageScope)}
                        />
                        {/* どこまで撮るかを目盛りで表示 */}
                        <span className="bk-scale" aria-hidden="true">
                          {COVERAGE_STAGES.map((stage, k) => (
                            <span key={stage} className={k < option.span ? "on" : ""}>
                              <i />
                              <small>{stage}</small>
                            </span>
                          ))}
                        </span>
                        <span className="bk-cover-label">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </Card>

              {/* 料金の目安 */}
              <div className="bk-price">
                <div>
                  <span className="bk-price-plan">STANDARD PLAN</span>
                  <p className="bk-price-yen">
                    ¥{BOOK_PLAN.priceLabel.match(/[\d,]+/)?.[0]}
                    <small>税込</small>
                  </p>
                </div>
                {isAppCoupon ? <span className="bk-coupon-badge">{WEDDING_TODO_COUPON.label}</span> : null}
                <p className="bk-price-note">{WCC_STANDARD_PACKAGE_DISCLAIMER}</p>
              </div>

              {/* クーポン */}
              <Card icon={<IconTicket />} title="クーポンコード" note="お持ちの方のみ">
                <div className="bk-inline">
                  <input
                    id="coupon-code"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    maxLength={COUPON_CODE_MAX_LENGTH}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="XXXX-XXXX-XXXX"
                    aria-label="クーポンコード"
                    className="bk-input bk-input-code"
                  />
                  {isAppCoupon ? (
                    <span className="bk-coupon-ok">
                      <Check />
                      {WEDDING_TODO_COUPON.label}
                    </span>
                  ) : null}
                </div>
              </Card>

              {/* 任意項目（閉じておく） */}
              <details className="bk-more">
                <summary>
                  <span className="bk-card-ic">
                    <IconPlus />
                  </span>
                  <span>
                    もっと伝えたいこと<small>任意・わかる範囲で</small>
                  </span>
                  <i aria-hidden="true" />
                </summary>
                <div className="bk-more-body">
                  <Field label="使用予定媒体（複数選択可）">
                    <div className="bk-chips">
                      {DELIVERY_CHANNEL_OPTIONS.map((option) => (
                        <label key={option.value} className={`bk-chip${deliveryChannels.includes(option.value) ? " on" : ""}`}>
                          <input
                            type="checkbox"
                            checked={deliveryChannels.includes(option.value)}
                            onChange={() => toggleDeliveryChannel(option.value)}
                          />
                          {deliveryChannels.includes(option.value) ? <Check /> : null}
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </Field>
                  <Field label="集合〜お開きの想定タイムライン" htmlFor="timeline-note">
                    <textarea id="timeline-note" value={timelineNote} onChange={(e) => setTimelineNote(e.target.value)} rows={3} className="bk-input bk-textarea" />
                  </Field>
                  <Field label="撮ってほしいシーン" htmlFor="requested-scenes">
                    <textarea
                      id="requested-scenes"
                      value={requestedScenes}
                      onChange={(e) => setRequestedScenes(e.target.value)}
                      rows={3}
                      placeholder="例: 家族とのカット、手紙、ファーストミート"
                      className="bk-input bk-textarea"
                    />
                  </Field>
                  <Field label="ご希望の追加オプション・撮影体制" htmlFor="extras-note">
                    <textarea
                      id="extras-note"
                      value={extrasNote}
                      onChange={(e) => setExtrasNote(e.target.value)}
                      rows={3}
                      placeholder="例: 撮影時間を延長したい、2名体制希望、機材レンタルあり、遠方出張あり。わかる範囲でご記入ください。詳細はお見積もりにてご提案します。"
                      className="bk-input bk-textarea"
                    />
                  </Field>
                  <Field label="参考動画URL（1行1URL）" htmlFor="reference-video-urls">
                    <textarea
                      id="reference-video-urls"
                      value={referenceVideoUrlsText}
                      onChange={(e) => setReferenceVideoUrlsText(e.target.value)}
                      rows={3}
                      placeholder="https://..."
                      className="bk-input bk-textarea"
                    />
                  </Field>
                  <Field label="会場側の撮影制限情報" htmlFor="venue-restrictions">
                    <textarea
                      id="venue-restrictions"
                      value={venueRestrictions}
                      onChange={(e) => setVenueRestrictions(e.target.value)}
                      rows={2}
                      className="bk-input bk-textarea"
                    />
                  </Field>
                </div>
              </details>

              <div className="bk-actions bk-actions-pc">
                <button type="button" onClick={goToStep3} className="cta bk-cta">
                  次へ：送信内容を確認 <ArrowRight />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bk-form">
              {submitState === "success" ? (
                <div role="status" className="bk-done">
                  <span className="bk-done-mark">
                    <Check />
                  </span>
                  <p className="bk-done-title">ご相談内容を受け付けました</p>
                  <p className="bk-done-text">
                    通常24時間以内を目安に、ZOOM での打ち合わせのご案内メールをお送りします。
                  </p>
                </div>
              ) : null}

              <div className="bk-summary">
                <div className="bk-summary-head">
                  <span className="bk-card-ic">
                    <IconCheckList />
                  </span>
                  <p className="bk-card-title">送信内容</p>
                  {submitState !== "success" ? (
                    <button type="button" className="bk-edit" onClick={() => setStep(1)}>
                      <IconEdit />
                      修正する
                    </button>
                  ) : null}
                </div>
                <dl className="bk-dl">
                  <Row label="新郎" value={partner1FullName || "—"} />
                  <Row label="新婦" value={partner2FullName || "—"} />
                  <Row label="メール" value={bookerEmail.trim()} />
                  <Row label="電話番号" value={emergencyContact.trim() || "—"} />
                  <Row label="挙式日" value={dateLabel} />
                  <Row label="式場名" value={venueName.trim() || "—"} />
                  <Row label="開催エリア" value={venueArea.trim() || "—"} />
                  <Row label="開始時刻" value={startTimeLabel} />
                  <Row label="撮影範囲" value={coverageScopeLabel} />
                  <Row
                    label="料金目安"
                    value={
                      <>
                        {BOOK_PLAN.priceLabel}
                        {isAppCoupon ? <span className="bk-coupon-badge sm">{WEDDING_TODO_COUPON.label}</span> : null}
                      </>
                    }
                  />
                  {couponCodeForSubmission ? <Row label="クーポン" value={<span className="bk-mono">{couponCodeForSubmission}</span>} /> : null}
                </dl>
                <dl className="bk-dl bk-dl-sub">
                  <Row label="使用予定媒体" value={deliveryChannelsLabel} />
                  <Row label="参考動画URL" value={referenceVideoUrls.length ? referenceVideoUrls.join(" / ") : "—"} />
                  <Row label="想定タイムライン" value={timelineNote.trim() || "—"} />
                  <Row label="希望シーン" value={requestedScenes.trim() || "—"} />
                  {extrasNote.trim() ? <Row label="追加オプション・撮影体制" value={extrasNote.trim()} /> : null}
                  <Row label="撮影制限情報" value={venueRestrictions.trim() || "—"} />
                </dl>
              </div>

              {/* 送信後の流れ（図） */}
              <ol className="bk-next" aria-label="送信後の流れ">
                <li>
                  <span><IconMail /></span>ZOOMのご案内
                </li>
                <li>
                  <span><IconVideo /></span>打ち合わせ
                </li>
                <li>
                  <span><IconDoc /></span>お見積もり・請求URL
                </li>
              </ol>

              {submitError ? (
                <p role="alert" className="bk-alert">
                  <Alert />
                  {submitError}
                </p>
              ) : null}

              <div className="bk-actions bk-actions-pc">
                {submitState !== "success" ? (
                  <button type="button" onClick={() => setStep(1)} className="bk-back">
                    <ArrowLeft /> 戻る
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={submitState === "submitting" || submitState === "success"}
                  onClick={() => {
                    void submitBookingRequest();
                  }}
                  className="cta bk-cta"
                >
                  {submitState === "submitting" ? "送信中…" : submitState === "success" ? "送信済み" : "相談内容を送信"}
                  {submitState === "idle" || submitState === "error" ? <ArrowRight /> : null}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* スマホ：下に固定の送信ボタン */}
      {submitState !== "success" ? (
        <div className="bk-dock">
          <button
            type="button"
            className="cta bk-cta"
            disabled={step === 3 && submitState === "submitting"}
            onClick={() => (step === 1 ? goToStep3() : void submitBookingRequest())}
          >
            {step === 3 && submitState === "submitting" ? "送信中…" : stepPrimaryLabel}
            <ArrowRight />
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- 部品 ---------- */

function Card({
  icon,
  title,
  note,
  required,
  children,
}: {
  icon: ReactNode;
  title: string;
  note?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="bk-card">
      <div className="bk-card-head">
        <span className="bk-card-ic">{icon}</span>
        <p className="bk-card-title">
          {title}
          {required ? <span className="bk-req">必須</span> : null}
          {note ? <small>{note}</small> : null}
        </p>
      </div>
      <div className="bk-card-body">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string | null;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className={`bk-field${error ? " err" : ""}`}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="bk-label">
          {label}
        </label>
      ) : (
        <p className="bk-label">{label}</p>
      )}
      {children}
      {error ? (
        <p id={errorId} className="bk-err">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function NamePair({
  who,
  first,
  last,
  onFirst,
  onLast,
  idPrefix,
}: {
  who: string;
  first: string;
  last: string;
  onFirst: (v: string) => void;
  onLast: (v: string) => void;
  idPrefix: string;
}) {
  return (
    <div className="bk-name">
      <span className="bk-who">{who}</span>
      <div className="bk-name-inputs">
        <input
          id={`${idPrefix}-last-name`}
          value={last}
          onChange={(e) => onLast(e.target.value)}
          placeholder="姓"
          aria-label={`${who}の姓（必須）`}
          autoComplete="family-name"
          className="bk-input"
        />
        <input
          id={`${idPrefix}-first-name`}
          value={first}
          onChange={(e) => onFirst(e.target.value)}
          placeholder="名"
          aria-label={`${who}の名（必須）`}
          autoComplete="given-name"
          className="bk-input"
        />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className={`bk-toggle${checked ? " on" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="bk-switch" aria-hidden="true" />
      {label}
    </label>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="bk-dl-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
);
const Check = () => svg(<path d="m5 12.5 4.5 4.5L19 7.5" />);
const Alert = () => svg(<><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.01" /></>);
const ArrowRight = () => svg(<path d="M5 12h14M13 6l6 6-6 6" />);
const ArrowLeft = () => svg(<path d="M19 12H5M11 6l-6 6 6 6" />);
const IconCouple = () =>
  svg(<><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M3 19c.6-3 2.6-5 5-5s4.4 2 5 5M11 19c.6-3 2.6-5 5-5s4.4 2 5 5" /></>);
const IconMail = () => svg(<><path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" /></>);
const IconCalendar = () => svg(<><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>);
const IconTicket = () => svg(<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z" />);
const IconPlus = () => svg(<path d="M12 5v14M5 12h14" />);
const IconCheckList = () => svg(<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />);
const IconEdit = () => svg(<path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4" />);
const IconVideo = () => svg(<><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3" /></>);
const IconDoc = () => svg(<><path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h5" /></>);
