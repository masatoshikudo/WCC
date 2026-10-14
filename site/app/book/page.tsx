import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { BookFlowLoading } from "@/components/book/BookFlowLoading";
import { HomeB3Footer } from "@/components/home-b3/HomeB3Footer";
import { HomeB3Header } from "@/components/home-b3/HomeB3Header";
import { HomeB3Motion } from "@/components/home-b3/HomeB3Motion";
import { SplitH2 } from "@/components/home-b3/SplitH2";
import { SlotsChip } from "@/components/home-b3/SlotsChip";
import { getNextOpenMonth } from "@/lib/reception-capacity";

import "@/components/home-b3/home-b3.css";
import "@/components/book/book-b3.css";

export const metadata: Metadata = {
  title: "ご相談・お見積もり | For Your Wedding Day",
  description:
    "2026年12月以降に挙式の方のご相談・お見積もりフォーム。各月4組まで（先着）。日程未定の方も希望月を選んでご相談いただけます。",
};

const BookFlow = dynamic(() => import("@/components/book/BookFlow").then((m) => m.BookFlow), {
  loading: () => <BookFlowLoading />,
});

const ROOT_ID = "hb3";

/** 残り枠を表示するため、1分ごとに作り直す */
export const revalidate = 60;

/** ご相談・お見積もりページ（B3 デザイン：トップと同じ見た目のルール） */
export default async function BookPage() {
  const openMonth = await getNextOpenMonth();
  return (
    <div className="hb3 hb3-book" id={ROOT_ID}>
      <script dangerouslySetInnerHTML={{ __html: `document.getElementById("${ROOT_ID}").classList.add("js")` }} />
      <HomeB3Header />

      <section className="s bk-hero" aria-label="ご相談のご案内">
        <div className="wrap">
          <span className="eyebrow">
            <b />
            Booking
          </span>
          <SplitH2 parts={[{ text: "Let's " }, { text: "talk", italic: true }]} />
          <div className="bk-hero-meta">
            <SlotsChip month={openMonth} />
            <p className="ja">日程が未定でも、わかる範囲で大丈夫です</p>
          </div>
        </div>
      </section>

      <BookFlow />

      <HomeB3Footer />
      <HomeB3Motion rootId={ROOT_ID} />
    </div>
  );
}
