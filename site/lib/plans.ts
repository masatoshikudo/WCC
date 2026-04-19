/**
 * 料金・プランの単一ソース（トップ `#pricing` / 予約フロー / メール payload の整合用）
 */

export const WCC_PLAN_NOTE =
  "パッケージ料金は一括でお支払いいただきます（税抜価格）";

/** スタンダードパッケージ（`#pricing` / 予約フォーム）共通の注意書き */
export const WCC_STANDARD_PACKAGE_DISCLAIMER =
  "交通費は含まれておりません。また、場所や式場プランによっては宿泊が必要となる場合があります。";

export const WCC_PACKAGE_PLANS = [
  {
    id: "standard" as const,
    displayId: "01",
    name: "パッケージプラン",
    priceExTaxYen: 150_000,
    items: [
      "6時間のコンテンツ撮影",
      "24時間以内に納品",
      "詳細について話し合うZOOM相談",
      "公式LINEチャット相談",
      "編集済みのTikTokまたはReels動画2本",
      "メイキング映像、細部ショット、その他のシーン",
      "未編集の全素材",
    ],
  },
] as const;

export type WccPlanId = (typeof WCC_PACKAGE_PLANS)[number]["id"];

/** 予約確認・メール等で使う「150,000円（税抜）」形式 */
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
