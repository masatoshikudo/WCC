import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { BookFlowLoading } from "@/components/book/BookFlowLoading";
import { RECEPTION_COPY } from "@/lib/reception";

export const metadata: Metadata = {
  title: "ご相談・お見積もり | For Your Wedding Day",
  description:
    "2026年12月以降に挙式の方のご相談・お見積もりフォーム。各月4組まで（先着）。日程未定の方も希望月を選んでご相談いただけます。",
};

const BookFlow = dynamic(() => import("@/components/book/BookFlow").then((m) => m.BookFlow), {
  loading: () => <BookFlowLoading />,
});

export default function BookPage() {
  return (
    <>
      <section aria-label="ご相談のご案内">
        <div className="mx-auto w-full max-w-content px-4 pt-12 text-center md:px-6 md:pt-16 lg:px-8">
          <p className="mx-auto max-w-2xl text-center font-body text-base leading-relaxed text-ink-muted md:text-lg">
            {RECEPTION_COPY.bookIntroPrimary}
          </p>
          <p className="mt-3 text-center font-body text-sm leading-relaxed text-ink-muted md:text-base">
            日程が未定の方は、希望挙式月をお選びください
            <br />
            ご記入できる範囲で進めていただいて大丈夫です
          </p>
        </div>
      </section>
      <BookFlow />
    </>
  );
}
