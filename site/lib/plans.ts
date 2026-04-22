/**
 * 料金・プランの単一ソース（トップ `#pricing` / 予約フロー / メール payload の整合用）
 */

/** 特商法「支払時期」など、いつ支払うかの明示用 */
export const WCC_PAYMENT_TIMING_NOTE =
  "ご予約確定時（オンライン（ZOOM）でのお打ち合わせ後、お見積りをご案内したタイミング）に一括でお支払いいただきます。";

/** 税抜表示の補足（支払時期と併用） */
export const WCC_PACKAGE_TAX_LUMP_NOTE =
  "パッケージ料金の表示ならびにお支払い額は税抜です。";

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
      "ご契約前のオンライン（ZOOM）での無料相談・お打ち合わせ",
      "契約後の公式LINEチャット相談",
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
  planNote: `${WCC_PAYMENT_TIMING_NOTE}${WCC_PACKAGE_TAX_LUMP_NOTE}`,
}));
