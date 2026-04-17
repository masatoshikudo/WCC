/**
 * 料金・プランの単一ソース（packages / 予約フロー / メール payload の整合用）
 */

export const WCC_PLAN_NOTE =
  "プラン料金は一括でお支払いいただきます（税抜価格）";

export const WCC_PACKAGE_PLANS = [
  {
    id: "standard" as const,
    displayId: "01",
    name: "スタンダードプラン",
    priceExTaxYen: 100_000,
    items: [
      "6時間のコンテンツ撮影",
      "24時間以内に納品",
      "事前Zoom打ち合わせ",
      "編集済みTikTok/Reels 2本",
      "当日のBTS + ディテール + 主要シーン",
      "RAWデータ一式",
    ],
  },
  {
    id: "premium" as const,
    displayId: "02",
    name: "プレミアムプラン",
    priceExTaxYen: 240_000,
    items: [
      "9時間のフルデイ撮影",
      "編集済みTikTok/Reels 2本",
      "1日のハイライト動画",
      "スタンダードプランの内容を含む",
    ],
  },
] as const;

export type WccPlanId = (typeof WCC_PACKAGE_PLANS)[number]["id"];

/** 予約確認・メール等で使う「100,000円（税抜）」形式 */
export function formatPlanPriceExTaxLabel(yen: number): string {
  return `${yen.toLocaleString("ja-JP")}円（税抜）`;
}

/** 予約フロー用（従来の PLANS 形） */
export const WCC_BOOKING_PLANS = WCC_PACKAGE_PLANS.map((p) => ({
  id: p.id,
  label: p.name,
  priceLabel: formatPlanPriceExTaxLabel(p.priceExTaxYen),
  planNote: WCC_PLAN_NOTE,
}));
