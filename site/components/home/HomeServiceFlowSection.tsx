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
    title: "ご相談（ステップ 1〜3）",
    listStart: 1,
    steps: [
      {
        title: "お問い合わせ",
        body: "まずは「ご相談フォーム」より、日程や会場、ご希望のイメージをお知らせください。日程が未定の段階でも、お気軽にご相談いただけます。",
      },
      {
        title: "ご確認メールとZOOM日程の調整",
        body: "内容を確認後、担当者より確認のメールをお送りします。あわせて、詳細をお伺いするためのオンラインミーティング（ZOOM）のスケジュールを調整させていただきます。",
      },
      {
        title: "ZOOMミーティング（お打ち合わせ）",
        body: "おふたりのご要望や、当日のスケジュール、残したいシーンについて詳しくお伺いします。不安な点があれば、何でもご質問ください。",
      },
    ],
  },
  {
    id: "phase-contract",
    title: "ご契約（ステップ 4〜5）",
    listStart: 4,
    steps: [
      {
        title: "お見積りと決済URLの送付",
        body: "お打ち合わせの内容をもとに、最終的なお見積りと、お支払い用のリンク（Payment Link）をメールにてお送りいたします。",
      },
      {
        title: "お支払い（ご予約確定）",
        body: "お送りしたリンクより、クレジットカードにてお支払いをお願いいたします。決済の完了をもって、正式にクリエイターのスケジュールを確保し、ご予約確定となります。",
      },
    ],
  },
  {
    id: "phase-day",
    title: "準備〜当日（ステップ 6〜8）",
    listStart: 6,
    steps: [
      {
        title: "公式LINEへのご案内",
        body: (
          <>
            ご予約確定後、担当クリエイターと直接やり取りができる
            <strong className="font-semibold text-ink">公式LINE</strong>
            へご案内します。式の準備中も気軽に相談できる窓口です。
          </>
        ),
      },
      {
        title: "当日までのやり取り",
        body: (
          <>
            式の準備が進む中で変更があった場合や、新たに撮ってほしいシーンを思いついた場合は、
            <strong className="font-semibold text-ink">公式LINE</strong>
            でいつでもお気軽にご連絡ください。
          </>
        ),
      },
      {
        title: "挙式当日",
        body: "担当クリエイターがおふたりのそばに同行し、当日の高まりをそのままiPhoneで記録します。ハイライト動画は当日中〜翌日にはお届けしますので、すぐに皆様と共有していただけます。",
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
          わたしたちのサービスは、おふたりの負担を最小限に抑えながら、当日の空気感を確実にお届けするために、以下のステップで進みます。
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
