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
        a: "スマホ取材と短尺編集に特化し、当日中〜翌日の共有を重視します 長編記録やアルバムはプロ領域です",
        seeAlso: [{ href: HOME_ANCHOR_HREF.whatIsWcc, label: "WCCとは" }],
      },
      {
        q: "どの機材で撮影しますか？",
        a: "最新の iPhone または DJI Osmo Pocket で撮影します ジンバルやライトを適宜併用します",
      },
      {
        q: "フォト・ビデオチームと同時に入れますか？",
        a: "可能です 進行を妨げない形で、SNS向けの瞬間を撮影します",
        seeAlso: [{ href: HOME_ANCHOR_HREF.whatIsWcc, label: "WCCとは" }],
      },
      {
        q: "海外ウェディングにも対応できますか？",
        a: "エリア・日程によって対応可否が変わります まずはご相談フォームからお問い合わせください",
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
        a: "ハイライトは当日中〜24時間以内、追加編集は72時間以内が目安です 品目・撮影時間・納品内容は料金・プランの記載を優先してください",
        seeAlso: [{ href: HOME_ANCHOR_HREF.pricing, label: "料金とプラン" }],
      },
      {
        q: "お支払いのタイミングは？",
        a: "フォームよりお問い合わせいただいた後、お見積もりをメールでお送りします 記載の Stripe 決済リンクより一括でお支払いいただき、決済完了後に ZOOM お打ち合わせの日程調整へ進みます",
        seeAlso: [
          { href: HOME_ANCHOR_HREF.pricing, label: "料金とプラン" },
          { href: HOME_ANCHOR_HREF.serviceFlow, label: "ご利用の流れ" },
        ],
      },
      {
        q: "予約後、日程はどのように確定しますか？",
        a: "フォーム送信後、お見積もりメールをお送りします Stripe 決済リンクよりお支払いが完了した時点で、正式にご予約確定となります その後、ZOOM お打ち合わせにて撮影詳細を確認します",
        seeAlso: [
          { href: "/book", label: "ご予約" },
          { href: HOME_ANCHOR_HREF.serviceFlow, label: "ご利用の流れ" },
        ],
      },
      {
        q: "ZOOMお打ち合わせでは何を確認しますか？",
        a: "ご決済後の ZOOM ミーティングでは、撮影当日の動線・タイムライン、式場側のルール、ご希望の撮影シーンなどを確認します",
        seeAlso: [
          { href: HOME_ANCHOR_HREF.pricing, label: "料金とプラン" },
          { href: HOME_ANCHOR_HREF.serviceFlow, label: "ご利用の流れ" },
        ],
      },
      {
        q: "予約前に相談できますか？",
        a: "可能です まずはご相談フォームより、日程（未定でも可）とご希望内容をお知らせください",
        seeAlso: [{ href: HOME_ANCHOR_HREF.serviceFlow, label: "ご利用の流れ" }],
      },
      {
        q: "撮影時間中の食事手配は必要ですか？",
        a: "本パッケージの撮影時間中は、可能であればサプライヤーミールのご手配をお願いしています",
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
