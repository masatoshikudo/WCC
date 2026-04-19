/**
 * トップ `#faq` の単一ソース（表示・構造化データで同じ文言を参照する）
 * 情報の正と他セクションとの役割分担は DESIGN.md §10.5 を参照。
 */

import { HOME_ANCHOR_HREF } from "@/lib/site-links";

export const HOME_FAQ_GROUPS = [
  {
    id: "faq-service-content",
    title: "サービス内容・撮影について",
    items: [
      {
        q: "プロのフォト・ビデオ撮影と何が違いますか？",
        a: "スマホ取材と短尺編集に特化し、当日中〜翌日の共有を重視します。長編記録やアルバムはプロ領域です。",
        seeAlso: [{ href: HOME_ANCHOR_HREF.whatIsWcc, label: "WCCとは" }],
      },
      {
        q: "どの機材で撮影しますか？",
        a: "最新のiPhoneを中心に、ジンバルやライトを併用します。撮影データはRAWでもお渡し可能です。",
      },
      {
        q: "フォト・ビデオチームと同時に入れますか？",
        a: "可能です。進行を妨げない形で、SNS向けの瞬間を補完的に撮影します。",
        seeAlso: [{ href: HOME_ANCHOR_HREF.whatIsWcc, label: "WCCとは" }],
      },
      {
        q: "海外ウェディングにも対応できますか？",
        a: "エリア・日程によって対応可否が変わります。まずはお問い合わせからご相談ください。",
        seeAlso: [{ href: HOME_ANCHOR_HREF.pricing, label: "料金とプラン" }],
      },
    ],
  },
  {
    id: "faq-delivery-payment-day",
    title: "納品・料金・当日について",
    items: [
      {
        q: "納品までどれくらいかかりますか？",
        a: "ハイライトは当日中〜24時間以内、追加編集は72時間以内が目安です。品目・撮影時間・納品内容は料金・プランの記載を優先してください。",
        seeAlso: [{ href: HOME_ANCHOR_HREF.pricing, label: "料金とプラン" }],
      },
      {
        q: "お支払いのタイミングは？",
        a: "予約時にパッケージ料金を一括（税抜）でお支払いいただきます。手順の細目は予約フォームをご覧ください。",
        seeAlso: [{ href: HOME_ANCHOR_HREF.pricing, label: "料金とプラン" }],
      },
      {
        q: "予約後、日程はどのように確定しますか？",
        a: "予約フォーム送信後、パッケージ料金を一括でお支払いいただくことで日程が確定します。",
        seeAlso: [{ href: "/book", label: "ご予約" }],
      },
      {
        q: "最終Zoomでは何を確認しますか？",
        a: "当日の動線を確認します。",
        seeAlso: [{ href: HOME_ANCHOR_HREF.pricing, label: "料金とプラン" }],
      },
      {
        q: "予約前に相談できますか？",
        a: "可能です。お問い合わせフォームまたはLINEから、日程と希望内容をご共有ください。",
      },
      {
        q: "撮影時間中の食事手配は必要ですか？",
        a: "本パッケージの撮影時間中は、可能であればサプライヤーミールのご手配をお願いしています。",
        seeAlso: [{ href: HOME_ANCHOR_HREF.pricing, label: "料金とプラン" }],
      },
    ],
  },
] as const;

export type HomeFaqGroup = (typeof HOME_FAQ_GROUPS)[number];
export type HomeFaqItem = HomeFaqGroup["items"][number];

/** Google 検索向け FAQPage（https://schema.org/FAQPage） */
export function getHomeFaqJsonLd() {
  const mainEntity = HOME_FAQ_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.a,
      },
    })),
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
