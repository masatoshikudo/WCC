import { HOME_CONTENT_INNER_COLUMN_CLASS } from "@/lib/layout/home-sections";

const VALUES = [
  {
    lead: "演出より、その瞬間",
    body: "カメラを意識していない、ふとした表情を残します",
  },
  {
    lead: "つくり込みより、ありのまま",
    body: "飾らない感情こそ、見返したくなるから",
  },
  {
    lead: "記録より、ドキュメンタリー",
    body: "一日の空気を、そのまま持ち帰れるかたちで",
  },
  {
    lead: "特別な機材より、近い距離",
    body: "身軽なカメラで、親友のような距離から",
  },
  {
    lead: "ふたりだけでなく、みんなの目線も",
    body: "友人が撮った一コマも、まるごと一日のなかに",
  },
];

export function HomeValuesSection() {
  return (
    <section className="w-full scroll-mt-24 border-t-[1.5px] border-hairline bg-canvas pt-32 pb-32 md:pt-48 md:pb-48">
      <div className={HOME_CONTENT_INNER_COLUMN_CLASS}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-16 md:grid-cols-2 md:items-start md:gap-24 lg:gap-32">
            <h2
              className="font-heading font-normal text-[clamp(2rem,5vw,4rem)] leading-[1.12] text-ink"
              style={{ letterSpacing: "0.02em" }}
              lang="ja"
            >
              私たちが
              <br />
              大切にすること
            </h2>
            <ul className="flex flex-col gap-8">
              {VALUES.map((value) => (
                <li key={value.lead} className="font-body text-base leading-relaxed">
                  <span className="text-ink">{value.lead}</span>
                  <br />
                  <span className="text-ink-muted">{value.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
