/**
 * 受付ポリシー（挙式月・日付範囲・枠数・文案）の単一ソース。
 * LP コピーと /book バリデーションの両方から参照する。
 */

export const CAPACITY_PER_MONTH = 2;

export const GENERAL_WEDDING_MONTHS = ["2026-08", "2026-09", "2026-10"] as const;

export const JULY_WEDDING_MONTH = "2026-07" as const;

/** 7月挙式の例外受付締切（JST） */
export const JULY_EXCEPTION_DEADLINE = "2026-06-10T23:59:59+09:00";

export const RECEPTION_DATE_MAX = "2026-10-31";

export const RECEPTION_GENERAL_DATE_MIN = "2026-08-01";

export const JULY_EXCEPTION_DATE_MIN = "2026-07-01";

export const JULY_EXCEPTION_DATE_MAX = "2026-07-31";

export type PreferredWeddingMonth =
  | typeof JULY_WEDDING_MONTH
  | (typeof GENERAL_WEDDING_MONTHS)[number];

export type WeddingSchedulingInput = {
  dateUndecided: boolean;
  weddingDate: string;
  preferredWeddingMonth: PreferredWeddingMonth | "" | null | string;
};

export type WeddingSchedulingValidation =
  | { ok: true; monthKey: PreferredWeddingMonth }
  | { ok: false; message: string };

export type MonthAvailability = {
  monthKey: PreferredWeddingMonth;
  label: string;
  capacity: number;
  used: number;
  remaining: number;
  isFull: boolean;
};

export const RECEPTION_COPY = {
  generalHeadline: "2026年8月以降の挙式からご予約いただけます",
  receptionPeriod: "8〜10月挙式の受付を開始しました",
  capacityNote: "各月2組まで（先着）",
  foundingCouple:
    "Founding Couple として、8〜10月挙式のカップル2組（期間全体）を募集しています",
  julyException:
    "7月挙式をご検討の方は、2026年6月10日（火）23:59 までにご相談ください。以降は8月以降の挙式からの受付となります。",
  bookIntroPrimary: "2026年8〜10月挙式の方を受付中です（各月2組まで・先着）。",
  bookIntroJulyException:
    "7月挙式をご検討の方は、2026年6月10日（火）23:59 までにご相談ください。",
} as const;

const JULY_EXCEPTION_DEADLINE_MS = new Date(JULY_EXCEPTION_DEADLINE).getTime();

/** JST の YYYY-MM-DD */
export function formatJstDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function isJulyExceptionActive(now = new Date()): boolean {
  return now.getTime() <= JULY_EXCEPTION_DEADLINE_MS;
}

export function getSelectableWeddingMonths(now = new Date()): PreferredWeddingMonth[] {
  if (isJulyExceptionActive(now)) {
    return [JULY_WEDDING_MONTH, ...GENERAL_WEDDING_MONTHS];
  }
  return [...GENERAL_WEDDING_MONTHS];
}

export function getDatePickerBounds(now = new Date()): { min: string; max: string } {
  const today = formatJstDate(now);
  const policyMin = isJulyExceptionActive(now) ? JULY_EXCEPTION_DATE_MIN : RECEPTION_GENERAL_DATE_MIN;
  return {
    min: today > policyMin ? today : policyMin,
    max: RECEPTION_DATE_MAX,
  };
}

export function formatPreferredMonthLabel(monthKey: string): string {
  const [, month] = monthKey.split("-");
  const monthNum = Number.parseInt(month ?? "", 10);
  if (!Number.isFinite(monthNum)) return monthKey;
  return `${monthNum}月`;
}

export function formatPreferredMonthLabelLong(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const monthNum = Number.parseInt(month ?? "", 10);
  if (!Number.isFinite(monthNum)) return monthKey;
  return `${year}年${monthNum}月`;
}

export function monthKeyFromWeddingDate(
  weddingDate: string,
  now = new Date(),
): PreferredWeddingMonth | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weddingDate)) return null;
  const monthKey = weddingDate.slice(0, 7);
  if (getSelectableWeddingMonths(now).includes(monthKey as PreferredWeddingMonth)) {
    return monthKey as PreferredWeddingMonth;
  }
  return null;
}

export function isAllowedMonthKey(monthKey: string, now = new Date()): monthKey is PreferredWeddingMonth {
  return getSelectableWeddingMonths(now).includes(monthKey as PreferredWeddingMonth);
}

export function getMonthDateRange(monthKey: string): { start: string; end: string } {
  const [yearStr, monthStr] = monthKey.split("-");
  const year = Number.parseInt(yearStr ?? "", 10);
  const month = Number.parseInt(monthStr ?? "", 10);
  const lastDay = new Date(year, month, 0).getDate();
  return {
    start: `${monthKey}-01`,
    end: `${monthKey}-${String(lastDay).padStart(2, "0")}`,
  };
}

export function formatWeddingScheduleLabel(input: WeddingSchedulingInput): string {
  if (input.dateUndecided) {
    if (input.preferredWeddingMonth) {
      return `未定（${formatPreferredMonthLabelLong(input.preferredWeddingMonth)}ご希望）`;
    }
    return "未定";
  }
  if (!input.weddingDate) return "—";
  return formatJapaneseDate(input.weddingDate);
}

function formatJapaneseDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  return `${parts[0]}年${Number.parseInt(parts[1] ?? "", 10)}月${Number.parseInt(parts[2] ?? "", 10)}日`;
}

export function validateWeddingScheduling(
  input: WeddingSchedulingInput,
  now = new Date(),
): WeddingSchedulingValidation {
  if (input.dateUndecided) {
    const month = input.preferredWeddingMonth;
    if (!month) {
      return { ok: false, message: "日程未定の場合は、希望挙式月を選択してください。" };
    }
    if (!isAllowedMonthKey(month, now)) {
      return { ok: false, message: "選択された希望挙式月は現在受付対象外です。" };
    }
    return { ok: true, monthKey: month };
  }

  if (!input.weddingDate) {
    return {
      ok: false,
      message: "挙式日を入力してください（未定の場合はチェックを付けてください）。",
    };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.weddingDate)) {
    return { ok: false, message: "挙式日の形式が正しくありません。" };
  }

  const today = formatJstDate(now);
  if (input.weddingDate < today) {
    return { ok: false, message: "挙式日は本日より後の日付を選んでください。" };
  }

  const monthKey = monthKeyFromWeddingDate(input.weddingDate, now);
  if (!monthKey || !getSelectableWeddingMonths(now).includes(monthKey)) {
    if (isJulyExceptionActive(now)) {
      return {
        ok: false,
        message: "2026年7月〜10月の挙式を受付中です。該当する日付を選んでください。",
      };
    }
    return {
      ok: false,
      message: "2026年8月〜10月の挙式を受付中です。該当する日付を選んでください。",
    };
  }

  const { min, max } = getDatePickerBounds(now);
  if (input.weddingDate < min || input.weddingDate > max) {
    return { ok: false, message: "選択された挙式日は現在の受付期間外です。" };
  }

  return { ok: true, monthKey };
}

export function getCapacityErrorMessage(monthKey: PreferredWeddingMonth): string {
  return `${formatPreferredMonthLabelLong(monthKey)}の受付枠（${CAPACITY_PER_MONTH}組）が埋まっています。別の月をご検討ください。`;
}
