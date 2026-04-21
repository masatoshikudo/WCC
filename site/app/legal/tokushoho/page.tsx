import Link from "next/link";

import {
  TOKUSHOHO_PAGE_METADATA,
  buildTokuShohoSectionViews,
} from "@/lib/legal/tokushoho-page-spec";

export const metadata = TOKUSHOHO_PAGE_METADATA;

const sections = buildTokuShohoSectionViews();

export default function TokuShohoPage() {
  return (
    <div className="mx-auto w-full max-w-content px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-16">
      <h1 className="mt-3 font-display text-[1.75rem] font-bold text-ink">特定商取引法に基づく表記</h1>
      <p className="mt-3 max-w-3xl font-body leading-relaxed text-ink-muted">
        本ページは、Wedding Content Creator の取引条件を明示するための情報を掲載しています。ご不明点は
        <Link href="/contact" className="mx-1 text-ink underline underline-offset-4 hover:opacity-80">
          お問い合わせ
        </Link>
        からご連絡ください。
      </p>

      <div className="mt-10 space-y-6">
        {sections.map((section) => (
          <section key={section.id} className="rounded-sm border border-hairline bg-canvas-subtle p-6">
            <h2 className="font-display text-xl font-semibold text-ink">{section.title}</h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">{section.description}</p>

            <dl className="mt-5 divide-y divide-hairline border-y border-hairline">
              {section.items.map((item) => (
                <div key={item.id} className="grid gap-2 py-4 md:grid-cols-[220px_1fr] md:gap-5">
                  <dt className="font-body text-sm font-semibold text-ink">{item.label}</dt>
                  <dd className="font-body text-sm leading-relaxed text-ink-muted">
                    <p>{item.value}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
