import {
  CAPACITY_PER_MONTH,
  type MonthAvailability,
  type PreferredWeddingMonth,
  formatPreferredMonthLabelLong,
  getMonthDateRange,
  getSelectableWeddingMonths,
} from "@/lib/reception";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function countBookingIntentsForMonth(monthKey: PreferredWeddingMonth): Promise<number> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return 0;

  const { start, end } = getMonthDateRange(monthKey);

  const [datedResult, undecidedResult] = await Promise.all([
    supabase
      .from("booking_intents")
      .select("attempt_id", { count: "exact", head: true })
      .eq("date_undecided", false)
      .gte("wedding_date", start)
      .lte("wedding_date", end),
    supabase
      .from("booking_intents")
      .select("attempt_id", { count: "exact", head: true })
      .eq("date_undecided", true)
      .eq("preferred_wedding_month", monthKey),
  ]);

  if (datedResult.error) {
    console.error("[countBookingIntentsForMonth] dated", datedResult.error.message);
  }
  if (undecidedResult.error) {
    console.error("[countBookingIntentsForMonth] undecided", undecidedResult.error.message);
    // preferred_wedding_month 列が未適用の DB では undecided 側だけ失敗しうる
    if (datedResult.error) return 0;
  }

  return (datedResult.count ?? 0) + (undecidedResult.count ?? 0);
}

export async function getReceptionAvailability(): Promise<MonthAvailability[]> {
  const months = getSelectableWeddingMonths();
  const counts = await Promise.all(months.map((monthKey) => countBookingIntentsForMonth(monthKey)));

  return months.map((monthKey, index) => {
    const used = counts[index] ?? 0;
    const remaining = Math.max(CAPACITY_PER_MONTH - used, 0);
    return {
      monthKey,
      label: formatPreferredMonthLabelLong(monthKey),
      capacity: CAPACITY_PER_MONTH,
      used,
      remaining,
      isFull: remaining <= 0,
    };
  });
}

export async function isMonthAtCapacity(monthKey: PreferredWeddingMonth): Promise<boolean> {
  const used = await countBookingIntentsForMonth(monthKey);
  return used >= CAPACITY_PER_MONTH;
}
