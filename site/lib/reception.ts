/**
 * 受付ポリシー（挙式月・日付範囲・枠数・文案）の単一ソース。
 * LP コピーと /book バリデーションの両方から参照する。
 */

/**
 * 1か月あたりの受付枠（クーポン利用者を含めた合計）。
 * 枠は booking_intents の件数で数えるため、クーポンの有無で分けない。
 */
export const CAPACITY_PER_MONTH = 4;

/** 受付を始める挙式月（この月より前の挙式は受け付けない） */
export const RECEPTION_START_MONTH = "2026-12";

/** 受付開始月（または今月）から何か月先まで選べるようにするか */
export const RECEPTION_MONTHS_AHEAD = 12;

/** "YYYY-MM" 形式の挙式月 */
export type PreferredWeddingMonth = string;

export type WeddingSchedulingInput = {
  dateUndecided: boolean;
  weddingDate: string;
  preferredWeddingMonth: PreferredWeddingMonth | "" | null;
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
  generalHeadline: "2026年12月以降に挙式のふたりを受付中です（各月4組／先着）",
  receptionPeriod: "2026年12月以降の挙式を受付中です",
  capacityNote: "各月4組まで（先着）",
  foundingCouple:
    "Founding Couple として、8〜10月挙式予定のカップル2組を募集しています",
  bookIntroPrimary: "2026年12月以降に挙式の方を受付中です（各月4組まで・先着）。",
} as const;

/** JST の YYYY-MM-DD */
export function formatJstDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addMonths(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split("-").map((v) => Number.parseInt(v, 10));
  const index = y * 12 + (m - 1) + delta;
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** 今月（JST）と受付開始月の遅いほうから、RECEPTION_MONTHS_AHEAD か月分の挙式月 */
export function getSelectableWeddingMonths(now = new Date()): PreferredWeddingMonth[] {
  const currentMonth = formatJstDate(now).slice(0, 7);
  const first = currentMonth > RECEPTION_START_MONTH ? currentMonth : RECEPTION_START_MONTH;
  return Array.from({ length: RECEPTION_MONTHS_AHEAD }, (_, i) => addMonths(first, i));
}

export function getDatePickerBounds(now = new Date()): { min: string; max: string } {
  const today = formatJstDate(now);
  const months = getSelectableWeddingMonths(now);
  const policyMin = `${months[0]}-01`;
  return {
    min: today > policyMin ? today : policyMin,
    max: getMonthDateRange(months[months.length - 1]).end,
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
  if (getSelectableWeddingMonths(now).includes(monthKey)) {
    return monthKey;
  }
  return null;
}

export function isAllowedMonthKey(monthKey: string, now = new Date()): monthKey is PreferredWeddingMonth {
  return getSelectableWeddingMonths(now).includes(monthKey);
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

  const months = getSelectableWeddingMonths(now);
  const lastMonth = months[months.length - 1];
  if (input.weddingDate > getMonthDateRange(lastMonth).end) {
    return {
      ok: false,
      message: `現在は${formatPreferredMonthLabelLong(lastMonth)}までの挙式を受付中です。それより先の日程はお問い合わせください。`,
    };
  }

  const monthKey = monthKeyFromWeddingDate(input.weddingDate, now);
  if (!monthKey || !getSelectableWeddingMonths(now).includes(monthKey)) {
    return {
      ok: false,
      message: "2026年12月以降の挙式を受付中です。該当する日付を選んでください。",
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
