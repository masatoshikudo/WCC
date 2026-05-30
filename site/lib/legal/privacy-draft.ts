import { type DisclosureFieldStatus } from "@/lib/legal/tokushoho-draft";

export type PrivacyDraftField = {
  id: string;
  label: string;
  value: string;
  status: DisclosureFieldStatus;
  note?: string;
};

export type PrivacyDraft = {
  pagePath: string;
  pageTitle: string;
  purpose: string[];
  fields: PrivacyDraftField[];
};

/**
 * フェーズ1（情報収集）用ドラフト: プライバシーポリシー
 * 既存実装から確定できる情報と、運用・法務判断が必要な情報を分離して管理する。
 */
export const PRIVACY_DRAFT: PrivacyDraft = {
  pagePath: "/legal/privacy",
  pageTitle: "プライバシーポリシー",
  purpose: [
    "取得する個人情報と利用目的を明示する",
    "外部サービス利用時の取り扱いを明示する",
    "利用者からの問い合わせ・開示請求窓口を明示する",
  ],
  fields: [
    {
      id: "operator",
      label: "事業者情報",
      value: "株式会社NaTRIUM（運営統括責任者: 工藤雅俊）",
      status: "confirmed",
    },
    {
      id: "contact-window",
      label: "お問い合わせ窓口",
      value: "メール: mk@natrium.co.jp / 電話: 08036975639",
      status: "confirmed",
    },
    {
      id: "collected-data",
      label: "取得する情報",
      value:
        "お問い合わせ時に氏名、メールアドレス、電話番号、希望日、会場情報、相談内容等を取得します。予約時にメールアドレス、氏名（任意）、挙式日、プラン情報、決済に紐づく識別子（session_id 等）を取得します。",
      status: "confirmed",
      note: "contact schema / booking action の実装ベース",
    },
    {
      id: "usage-purpose",
      label: "利用目的",
      value:
        "お問い合わせ対応、予約受付・本人確認、決済処理との照合、確認連絡・通知メール送信、サービス品質向上のために利用します。",
      status: "confirmed",
    },
    {
      id: "external-services",
      label: "利用する外部サービス",
      value:
        "Supabase（問い合わせ・予約情報保存）、Resend（メール送信）、Stripe（決済処理）を利用します。また、サイトの利用状況分析のため PostHog（PostHog, Inc.／米国）を、実績紹介のため Instagram（Meta Platforms, Inc.）の埋め込みコンテンツの表示を利用します。これらの外部サービスにおける情報の取り扱いは、各社のプライバシーポリシーに従います。",
      status: "confirmed",
    },
    {
      id: "third-party-provision",
      label: "第三者提供",
      value:
        "法令に基づく場合を除き、本人の同意なく個人情報を第三者へ提供しません。決済・メール配信等の業務委託先には必要な範囲で情報を提供します。",
      status: "needs_review",
      note: "委託と第三者提供の定義・表現は法務確認推奨",
    },
    {
      id: "retention",
      label: "保有期間・削除",
      value: "未設定",
      status: "needs_input",
      note: "問い合わせ・予約データの保存期間と削除方針を運用決定",
    },
    {
      id: "security",
      label: "安全管理措置",
      value:
        "アクセス制御、認証情報の適切な管理、サーバーサイド処理の分離等、個人情報への不正アクセス・漏えい防止に必要な措置を講じます。",
      status: "needs_review",
      note: "実運用の統制に合わせて具体化",
    },
    {
      id: "cookies-analytics",
      label: "Cookie・アクセス解析",
      value:
        "サイトの利用状況を把握し品質向上に役立てるため、PostHog（PostHog, Inc.／米国）を用いてアクセス解析を行います。この際、Cookie や匿名の識別子を使用し、閲覧ページや操作等の情報が PostHog 社のサーバー（米国）へ送信されます。氏名・メールアドレス等、個人を直接特定する情報を解析目的で送信することはありません。また、実績紹介のために表示する Instagram（Meta Platforms, Inc.）の埋め込みコンテンツの閲覧時には、Meta 社の Cookie（第三者 Cookie）が設定され、IP アドレス等の情報が同社へ送信される場合があります。これらの取り扱いは各社のプライバシーポリシーに従います。Cookie はブラウザの設定で拒否・削除できますが、一部の機能がご利用いただけなくなる場合があります。",
      status: "needs_review",
      note: "PostHog 計測・Instagram 埋め込み導入に伴い記載（文面は法務確認推奨）",
    },
    {
      id: "disclosure-rights",
      label: "開示・訂正・利用停止等の請求",
      value: "未設定",
      status: "needs_input",
      note: "請求方法、本人確認手順、回答目安を定義",
    },
    {
      id: "revision",
      label: "改定",
      value: "本ポリシーは必要に応じて改定し、改定後は本ページに掲載した時点で効力を生じます。",
      status: "needs_review",
    },
    {
      id: "effective-date",
      label: "制定日・改定日",
      value: "未設定",
      status: "needs_input",
    },
  ],
};
