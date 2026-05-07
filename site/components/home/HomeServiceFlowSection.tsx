import type { CSSProperties, ReactNode } from "react";

import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";

const SERVICE_FLOW_SECTION_ROOT_CLASS =
  "w-full scroll-mt-48 border-t border-hairline bg-canvas pt-40 pb-40 md:pt-48 md:pb-48";

type FlowStep = {
  title: string;
  body: ReactNode;
};

type FlowPhase = {
  id: string;
  title: string;
  /** このフェーズ先頭のステップ番号（連番用） */
  listStart: number;
  steps: FlowStep[];
};

const PHASES: FlowPhase[] = [
  {
    id: "phase-consult",
    title: "ご相談・お見積もり（ステップ 1〜3）",
    listStart: 1,
    steps: [
      {
        title: "フォームからのご相談",
        body: "まずは「ご相談フォーム」より、挙式の日程・会場・ご希望のイメージをお知らせください。日程が未定の段階でも、ご相談いただけます。",
      },
      {
        title: "お見積もりのご案内",
        body: "ご入力内容をもとに、担当よりお見積もりをメールにてお送りします。通常、2 営業日以内にお送りします。ご質問やご要望の追加があれば、メールにてご返信ください。",
      },
      {
        title: "請求書のご送付",
        body: "お見積もりにご納得いただけましたら、Stripe の請求書 URL をメールにてお送りします。",
      },
    ],
  },
  {
    id: "phase-contract",
    title: "ご契約（ステップ 4〜6）",
    listStart: 4,
    steps: [
      {
        title: "お支払い（ご予約確定）",
        body: "請求書 URL より、クレジットカードにてお支払いをお願いいたします。ご決済完了をもって、正式にクリエイターのスケジュールを確保し、ご予約確定となります。",
      },
      {
        title: "公式 LINE のご案内",
        body: (
          <>
            ご決済完了後、担当クリエイターと直接やり取りができる
            <strong className="font-semibold text-ink">公式 LINE</strong>
            へお招きします。以降のご連絡は公式 LINE を通じて行います。
          </>
        ),
      },
      {
        title: "ZOOM ミーティング（詳細打ち合わせ）",
        body: "公式 LINE にてご案内するリンクから ZOOM ミーティングを予約いただきます。撮影当日の動線・タイムライン、式場のルール、残したいシーンなどを確認します。",
      },
    ],
  },
  {
    id: "phase-day",
    title: "準備〜当日（ステップ 7〜8）",
    listStart: 7,
    steps: [
      {
        title: "当日までのやり取り",
        body: (
          <>
            式の準備が進む中で変更があった場合や、新たに撮ってほしいシーンを思いついた場合は、
            <strong className="font-semibold text-ink">公式 LINE</strong>
            でいつでもご連絡ください。
          </>
        ),
      },
      {
        title: "挙式当日",
        body: "担当クリエイターがお二人のそばに同行し、当日の高まりをそのまま iPhone または DJI Osmo Pocket で記録します。撮影完了後、24 時間以内にハイライト動画をお届けしますので、すぐに皆様にお送りいただけます。",
      },
    ],
  },
];

type HomeServiceFlowSectionProps = {
  sectionH2ClassName: string;
  sectionH2Style: CSSProperties;
};

export function HomeServiceFlowSection({
  sectionH2ClassName,
  sectionH2Style,
}: HomeServiceFlowSectionProps) {
  return (
    <section
      id="service-flow"
      className={SERVICE_FLOW_SECTION_ROOT_CLASS}
      aria-labelledby="service-flow-heading"
    >
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <h2 id="service-flow-heading" className={sectionH2ClassName} style={sectionH2Style}>
          ご相談から当日までの流れ
        </h2>
        <p className="mx-auto mt-6 max-w-prose text-center font-body text-sm leading-relaxed text-ink-muted md:mt-8 md:text-base">
          わたしたちのサービスは、お二人の負担を最小限に抑えながら、当日の空気感を確実にお届けするために、以下のステップで進みます。
        </p>

        <div className="mx-auto mt-14 max-w-3xl space-y-14 md:mt-16 md:space-y-16">
          {PHASES.map((phase) => (
            <div key={phase.id}>
              <h3 className="font-display text-lg font-semibold text-ink md:text-xl">{phase.title}</h3>
              <ol
                className="mt-6 list-outside list-decimal space-y-8 pl-6 marker:font-semibold marker:text-ink md:mt-8 md:pl-8"
                start={phase.listStart}
              >
                {phase.steps.map((step) => (
                  <li key={step.title} className="pl-2">
                    <p className="font-body text-base font-semibold text-ink">{step.title}</p>
                    <div className="mt-2 font-body text-sm leading-relaxed text-ink-muted md:text-base">
                      {step.body}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
