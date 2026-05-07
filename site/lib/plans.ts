/**
 * 料金・プランの単一ソース（トップ `#pricing` / 予約フロー / メール payload の整合用）
 */

/** 特商法「支払時期」など、いつ支払うかの明示用 */
export const WCC_PAYMENT_TIMING_NOTE =
  "お見積りメール記載の Stripe 決済リンクより一括でお支払いいただきます。決済完了後、公式 LINE へのご招待と ZOOM お打ち合わせ日程調整のご案内をお送りします。";

/** 税込表示の補足（支払時期と併用） */
export const WCC_PACKAGE_TAX_LUMP_NOTE =
  "パッケージ料金の表示額は税込です。";

/** スタンダードパッケージ（`#pricing` / 予約フォーム）共通の注意書き */
export const WCC_STANDARD_PACKAGE_DISCLAIMER =
  "交通費は含まれておりません。また、場所や式場プランによっては宿泊が必要となる場合があります。";

export const WCC_PACKAGE_PLANS = [
  {
    id: "standard" as const,
    displayId: "01",
    name: "スタンダードプラン",
    // TODO: Stripe ダッシュボード側で Price を 176,000 円（税込）に更新し、.env.local と Vercel の STRIPE_PRICE_ID も差し替えること
    priceExTaxYen: 160_000,
    priceInTaxYen: 176_000,
    items: [
      "4時間連続のコンテンツ撮影",
      "24時間以内に納品",
      "ご決済後の ZOOM ミーティング（詳細打ち合わせ）",
      "契約後の公式LINEチャット相談",
      "編集済みのTikTokまたはReels動画2本",
      "メイキング映像、細部ショット、その他のシーン",
      "未編集の全素材",
    ],
  },
] as const;

export type WccPlanId = (typeof WCC_PACKAGE_PLANS)[number]["id"];

/** 予約確認・メール等で使う「176,000円（税込）」形式 */
export function formatPlanPriceInTaxLabel(yen: number): string {
  return `${yen.toLocaleString("ja-JP")}円（税込）`;
}

/** 予約フロー用（従来の PLANS 形） */
export const WCC_BOOKING_PLANS = WCC_PACKAGE_PLANS.map((p) => ({
  id: p.id,
  label: p.name,
  priceLabel: formatPlanPriceInTaxLabel(p.priceInTaxYen),
  planNote: `${WCC_PAYMENT_TIMING_NOTE}${WCC_PACKAGE_TAX_LUMP_NOTE}`,
}));

/** エクストラオプション（/pricing ページ用） */
export const WCC_EXTRAS = [
  { id: "extension", name: "撮影時間延長", priceYen: 33_000, unit: "回", note: "※2 名体制時は +25% 加算", maxQuantity: null },
  { id: "additional-edit", name: "追加編集動画", priceYen: 33_000, unit: "本", note: null, maxQuantity: null },
  { id: "additional-staff", name: "WCC スタッフ追加", priceYen: 132_000, unit: "人", note: null, maxQuantity: null },
  { id: "equipment-rental", name: "機材レンタル", priceYen: 38_500, unit: "台", note: null, maxQuantity: 2 },
  { id: "remote-travel", name: "遠方交通費実費", priceYen: 11_000, unit: "件", note: "※実費に加算", maxQuantity: null },
] as const;

export type WccExtra = (typeof WCC_EXTRAS)[number];
