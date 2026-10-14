import type { CSSProperties } from "react";

import { CAPACITY_PER_MONTH, formatPreferredMonthLabel, type MonthAvailability } from "@/lib/reception";

/** 残り枠チップ：いま受付中の月と、その月の残り枠（丸の塗り＝空き） */
export function SlotsChip({
  month,
  className = "slots",
  style,
}: {
  month: MonthAvailability | null;
  className?: string;
  style?: CSSProperties;
}) {
  const remaining = month?.remaining ?? 0;
  const label = month ? `${formatPreferredMonthLabel(month.monthKey)} 残り${remaining}組` : "受付枠は満席です";
  return (
    <div className={className} style={style}>
      <span className="d" aria-hidden="true">
        {Array.from({ length: CAPACITY_PER_MONTH }, (_, k) => (
          <i key={k} className={k < remaining ? "on" : undefined} style={{ ["--k" as string]: k }} />
        ))}
      </span>
      <span>{label}</span>
    </div>
  );
}
