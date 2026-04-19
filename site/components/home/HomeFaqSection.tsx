/**
 * トップ `#faq`。表示・構造化データの文言は `@/lib/home-faq`。
 * 他セクションとの情報の正の分担は DESIGN.md §10.5。
 */
import type { CSSProperties } from "react";
import Link from "next/link";

import { HOME_SECTION_ANCHOR_STACK_CLASS } from "@/lib/layout/home-sections";
import { HOME_FAQ_GROUPS } from "@/lib/home-faq";

type HomeFaqSectionProps = {
  sectionH2ClassName: string;
  sectionH2Style: CSSProperties;
};

export function HomeFaqSection({ sectionH2ClassName, sectionH2Style }: HomeFaqSectionProps) {
  return (
    <section id="faq" className={HOME_SECTION_ANCHOR_STACK_CLASS} aria-labelledby="faq-heading">
      <h2 id="faq-heading" className={sectionH2ClassName} style={sectionH2Style}>
        よくある質問
      </h2>
      <div className="mt-10 space-y-12">
        {HOME_FAQ_GROUPS.map((group) => (
          <div key={group.id}>
            <h3
              id={group.id}
              className="mx-auto max-w-4xl scroll-mt-24 text-center font-display text-xl font-semibold text-ink md:text-[1.35rem]"
            >
              {group.title}
            </h3>
            <div className="mt-4 divide-y divide-hairline border-y border-hairline">
              {group.items.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="font-body flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink">
                    {faq.q}
                    <span className="text-ink-muted group-open:hidden" aria-hidden="true">
                      +
                    </span>
                    <span className="hidden text-ink-muted group-open:inline" aria-hidden="true">
                      −
                    </span>
                  </summary>
                  <p className="mt-3 font-body leading-relaxed text-ink-muted">{faq.a}</p>
                  {"seeAlso" in faq && faq.seeAlso.length > 0 ? (
                    <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">
                      <span className="text-ink-muted">サイト内: </span>
                      {faq.seeAlso.map((link, i) => (
                        <span key={link.href}>
                          {i > 0 ? " · " : null}
                          <Link
                            href={link.href}
                            className="text-ink underline underline-offset-4 hover:opacity-70"
                          >
                            {link.label}
                          </Link>
                        </span>
                      ))}
                    </p>
                  ) : null}
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
