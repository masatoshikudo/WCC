/**
 * 料金・プランの単一ソース（トップ `#pricing` / 予約フロー / メール payload の整合用）
 */

/** 特商法「支払時期」など、いつ支払うかの明示用 */
export const WCC_PAYMENT_TIMING_NOTE =
  "お見積もりメール記載の Stripe 決済リンクより一括でお支払いいただきます 決済完了後、公式 LINE へのご招待と ZOOM お打ち合わせ日程調整のご案内をお送りします";

/** 税込表示の補足（支払時期と併用） */
export const WCC_PACKAGE_TAX_LUMP_NOTE =
  "パッケージ料金の表示額は税込です";

/** スタンダードパッケージ（`#pricing` / 予約フォーム）共通の注意書き */
export const WCC_STANDARD_PACKAGE_DISCLAIMER =
  "交通費は含まれておりません また、場所や式場プランによっては宿泊が必要となる場合があります";

export const WCC_PACKAGE_PLANS = [
  {
    id: "standard" as const,
    displayId: "01",
    name: "スタンダードプラン",
    // TODO: Stripe ダッシュボード側で Price を 176,000 円（税込）に更新し、.env.local と Vercel の STRIPE_PRICE_ID も差し替えること
    priceExTaxYen: 160_000,
    priceInTaxYen: 176_000,
    items: [
      "4 時間連続のコンテンツ撮影",
      "24 時間以内に納品",
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
  {
    id: "extension",
    name: "撮影時間延長",
    priceYen: 33_000,
    unit: "time",
    note: "※2 名体制時は +25% 加算",
    description: "1 時間単位で撮影時間を延長（2 名体制時は +25% 加算）",
    maxQuantity: null,
  },
  {
    id: "additional-edit",
    name: "追加編集動画",
    priceYen: 33_000,
    unit: "video",
    note: null,
    description: "標準 2 本以上の編集",
    maxQuantity: null,
  },
  {
    id: "additional-staff",
    name: "WCC スタッフ追加",
    priceYen: 132_000,
    unit: "person",
    note: "時間内固定",
    description: "撮影クリエイターを追加（時間内固定）",
    maxQuantity: null,
  },
  {
    id: "gear-rental",
    name: "ご友人撮影オプション(DJI Osmo Pocket 貸出)",
    priceYen: 38_500,
    unit: "unit",
    note: "最大 2 台",
    description:
      "ご友人代表の方に DJI Osmo Pocket をお渡しし、ご友人視点での撮影をお願いいただけるオプションです。",
    breakdown: [
      "機材貸出（DJI Osmo Pocket、当日）",
      "友人撮影分の素材確認・編集組み込み",
      "機材保険・消耗品",
    ],
    maxQuantity: 2,
  },
  {
    id: "travel",
    name: "遠方出張費",
    priceYen: 11_000,
    unit: "flat",
    note: "関東圏外、実費 + 11,000 円",
    description: "関東圏外への出張対応（交通費・宿泊費別）",
    maxQuantity: 1,
  },
] as const;

export type WccExtra = (typeof WCC_EXTRAS)[number];

/**
 * WccExtra の unit に応じた価格表示文字列を返す。
 * - time:   "+33,000 円 / 1 時間"
 * - video:  "+33,000 円 / 1 本"
 * - person: "+132,000 円 / 1 名"
 * - unit:   "+38,500 円 / 1 台"
 * - flat:   "実費 + 11,000 円"
 */
export function formatExtraPrice(extra: WccExtra): string {
  const formattedYen = extra.priceYen.toLocaleString("ja-JP");
  const unit = extra.unit;

  switch (unit) {
    case "time":
      return `+${formattedYen} 円 / 1 時間`;
    case "video":
      return `+${formattedYen} 円 / 1 本`;
    case "person":
      return `+${formattedYen} 円 / 1 名`;
    case "unit":
      return `+${formattedYen} 円 / 1 台`;
    case "flat":
      return `実費 + ${formattedYen} 円`;
    default: {
      const _exhaustive: never = unit;
      throw new Error(`Unknown extra unit: ${_exhaustive}`);
    }
  }
}
