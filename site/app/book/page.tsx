import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { BookFlowLoading } from "@/components/book/BookFlowLoading";

export const metadata: Metadata = {
  title: "ご相談・お見積もり | For Your Wedding Day",
  description:
    "結婚式当日の縦動画パッケージのご相談・お見積もりフォーム。日程が決まっていなくても、式場が確定していなくても、まずはお知らせください。",
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
            日程が決まっていなくても、式場が確定していなくても
            <br />
            まずはお知らせください
          </p>
          <p className="mt-3 text-center font-body text-sm leading-relaxed text-ink-muted md:text-base">
            「空き状況だけ確認したい」「希望シーンの相談だけしたい」段階でも
            <br />
            フォームから送っていただいて大丈夫です
            <br />
            ご記入できる範囲で進めてください
          </p>
        </div>
      </section>
      <BookFlow />
    </>
  );
}
