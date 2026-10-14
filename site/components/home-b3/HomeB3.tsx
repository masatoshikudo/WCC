import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { HomeB3Header } from "@/components/home-b3/HomeB3Header";
import { HomeB3Motion } from "@/components/home-b3/HomeB3Motion";
import { PetalCanvas } from "@/components/home-b3/PetalCanvas";
import { SplitH2 } from "@/components/home-b3/SplitH2";
import { HOME_FAQ_GROUPS } from "@/lib/home-faq";
import { WCC_EXTRAS, WCC_PACKAGE_PLANS } from "@/lib/plans";
import { CAPACITY_PER_MONTH, RECEPTION_START_MONTH } from "@/lib/reception";
import { LEGAL_PAGE_HREF } from "@/lib/site-links";

import "./home-b3.css";

/**
 * トップページ（B3：シルバー背景・文字の間に動画）。
 * 見た目の元: docs/design/home/home-b3.html ／ 決定事項: docs/WCC_BRAND.md セクション 13
 */

const ROOT_ID = "hb3";
const HERO_ID = "top";
const BOOK = "/book";

const V = "/videos/realmoment";
const P = "/images/highlight-posters";

const d = (k: number): CSSProperties => ({ ["--d" as string]: k });

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function Cta({ href = BOOK, className = "cta", style }: { href?: string; className?: string; style?: CSSProperties }) {
  return (
    <Link className={className} href={href} style={style}>
      まず相談する <Arrow />
    </Link>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <b />
      {children}
    </span>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  );
}

const WORKS = [
  { n: "01", key: "reception-1", label: "披露宴" },
  { n: "02", key: "reception-2", label: "披露宴" },
  { n: "03", key: "afterparty-1", label: "2次会" },
  { n: "04", key: "afterparty-2", label: "2次会" },
] as const;

const VALUES: { lead: string; sub: string; icon: ReactNode }[] = [
  {
    lead: "演出より、その瞬間",
    sub: "カメラを意識していない表情",
    icon: (
      <>
        <circle cx="12" cy="12" r="3.2" pathLength={1} />
        <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z" pathLength={1} />
      </>
    ),
  },
  {
    lead: "つくり込みより、ありのまま",
    sub: "飾らない気持ちを残す",
    icon: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" pathLength={1} />,
  },
  {
    lead: "記録より、ドキュメンタリー",
    sub: "一日の空気ごと持ち帰る",
    icon: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="2" pathLength={1} />
        <path d="m11 10 3 2-3 2z" pathLength={1} />
      </>
    ),
  },
  {
    lead: "特別な機材より、近い距離",
    sub: "身軽なカメラで、そばにいる",
    icon: (
      <>
        <circle cx="8" cy="9" r="3" pathLength={1} />
        <circle cx="16" cy="9" r="3" pathLength={1} />
        <path d="M3 19c.6-3 2.6-5 5-5s4.4 2 5 5M11 19c.6-3 2.6-5 5-5s4.4 2 5 5" pathLength={1} />
      </>
    ),
  },
  {
    lead: "ふたりだけでなく、みんなの目線も",
    sub: "友人が撮った一コマも入れる",
    icon: (
      <>
        <path d="M4 8h3l2-3h6l2 3h3v11H4z" pathLength={1} />
        <circle cx="12" cy="13" r="3.5" pathLength={1} />
      </>
    ),
  },
];

const SPECS = [
  { num: 4, unit: "h", label: "連続で撮影" },
  { num: 24, unit: "h", label: "以内に1本目を納品" },
  { num: 60, unit: "s", label: "以内の動画 1本" },
  { num: 120, unit: "s", label: "合計の縦型動画" },
] as const;

const INCLUDED: { label: string; icon: ReactNode }[] = [
  {
    label: "挙式前のZOOM打ち合わせ",
    icon: (
      <>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10 5-3v10l-5-3" />
      </>
    ),
  },
  { label: "契約後のLINE相談", icon: <path d="M4 5h16v11H9l-5 4z" /> },
  { label: "未編集の全素材", icon: <path d="M3 7h6l2 2h10v10H3z" /> },
  {
    label: "メイキング・細部ショットも対応",
    icon: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-4.5-4.5" />
      </>
    ),
  },
];

/** オプションの表示名（料金は lib/plans.ts の WCC_EXTRAS が正） */
const EXTRA_LABEL: Record<string, string> = {
  extension: "撮影時間延長",
  "additional-edit": "追加編集動画",
  "additional-staff": "スタッフ追加",
  "gear-rental": "ご友人撮影（DJI Osmo Pocket 貸出・最大2台）",
  travel: "遠方出張（関東圏外）",
};
const UNIT_LABEL: Record<string, string> = { time: "1時間", video: "1本", person: "1名", unit: "1台" };
const yen = (n: number) => n.toLocaleString("ja-JP");
const extraPrice = (e: (typeof WCC_EXTRAS)[number]) =>
  e.unit === "flat" ? `実費 + ${yen(e.priceYen)}円` : `+${yen(e.priceYen)}円 / ${UNIT_LABEL[e.unit]}`;

const FLOW: { label: string; key?: boolean; icon: ReactNode }[] = [
  { label: "フォームで相談", icon: <path d="M4 4h16v12H8l-4 4z" /> },
  {
    label: "ZOOMで打ち合わせ",
    icon: (
      <>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10 5-3v10l-5-3" />
      </>
    ),
  },
  {
    label: "お見積もり",
    icon: (
      <>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M9 12h7M9 16h5" />
      </>
    ),
  },
  {
    label: "請求書をメールで送付",
    icon: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  },
  {
    label: "お支払いで予約確定",
    key: true,
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </>
    ),
  },
  { label: "公式LINEへ招待", icon: <path d="M4 5h16v11H9l-5 4z" /> },
  { label: "LINEでいつでも追加の相談", icon: <path d="M4 12h16M12 4v16" /> },
  {
    label: "挙式当日 → 24時間以内に納品",
    key: true,
    icon: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
];

export function HomeB3() {
  const plan = WCC_PACKAGE_PLANS[0];
  const slotsLabel = `${RECEPTION_START_MONTH.replace("-", ".")}〜 / 各月${CAPACITY_PER_MONTH}組`;
  let faqIndex = 0;

  return (
    <div className="hb3" id={ROOT_ID}>
      {/* 動きの初期状態（隠しておく要素）を、表示前に有効にする */}
      <script
        dangerouslySetInnerHTML={{ __html: `document.getElementById("${ROOT_ID}").classList.add("js")` }}
      />
      <HomeB3Header />

      {/* ① FV */}
      <section className="hero" id={HERO_ID} aria-label="For your wedding day">
        <PetalCanvas heroId={HERO_ID} />
        <div className="big" aria-hidden="true">
          <div className="row">
            <span className="w d1">For</span>
            <span className="pill">
              <video src={`${V}/fv-1.mp4`} poster={`${P}/realmoment-fv-1.jpg`} muted loop playsInline autoPlay preload="metadata" />
            </span>
            <span className="w d2">
              <em>your</em>
            </span>
          </div>
          <div className="row split">
            <span className="w d3">wedding</span>
            <span className="pill p2">
              <video src={`${V}/fv-2.mp4`} poster={`${P}/realmoment-fv-2.jpg`} muted loop playsInline autoPlay preload="metadata" />
            </span>
            <span className="w d4">day</span>
          </div>
        </div>
        <div className="sub">
          <h1 lang="ja">明日のふたりへ</h1>
          <Cta />
        </div>
      </section>
      {/* FV と作例の境目に置く下矢印（境目で色が反転する） */}
      <div className="seam">
        <a className="down" href="#works" aria-label="作例を見る">
          <svg viewBox="0 0 24 64" aria-hidden="true">
            <path d="M12 2v58M5 53l7 7 7-7" />
          </svg>
        </a>
      </div>

      {/* ② 作例 */}
      <section className="s dark" id="works">
        <div className="wrap works-head">
          <div>
            <Eyebrow>Works</Eyebrow>
            <SplitH2 parts={[{ text: "Real " }, { text: "moments", italic: true }]} />
            <p className="ja">9:16の縦動画で残します</p>
          </div>
          <div className="arrows rv" style={d(0)}>
            <button type="button" aria-label="前へ" data-dir="-1">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M13 8H3M7 4 3 8l4 4" />
              </svg>
            </button>
            <button type="button" aria-label="次へ" data-dir="1">
              <Arrow />
            </button>
          </div>
        </div>
        <div className="reel">
          {WORKS.map((w, k) => (
            <figure key={w.key} className="clip rv" style={d(k)}>
              <span className="n">{w.n}</span>
              <video
                data-src={`${V}/realmoment-${w.key}.mp4`}
                poster={`${P}/realmoment-${w.key}.jpg`}
                muted
                loop
                playsInline
                preload="none"
                aria-label={`${w.label}の作例動画`}
              />
            </figure>
          ))}
          <a
            className="clip ig rv"
            style={d(WORKS.length)}
            href="https://www.instagram.com/reel/DLXNT3kh9ed/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ウェディング映像サンプル（Instagramで見る）"
          >
            <span className="n">05</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/thumbnail.jpg" alt="" loading="lazy" />
            <span className="ig-play">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="ig-tag">Instagramで見る</span>
          </a>
        </div>
      </section>

      {/* ③ 大切にすること */}
      <section className="s light" id="values">
        <div className="wrap">
          <Eyebrow>Our way</Eyebrow>
          <SplitH2 parts={[{ text: "As " }, { text: "it", italic: true }, { text: " is" }]} />
          <p className="ja">演出せずに、その日のまま残す</p>
          <div className="vals">
            {VALUES.map((v, k) => (
              <div key={v.lead} className="val rv" style={d(k)}>
                <span className="ic">
                  <Icon>{v.icon}</Icon>
                </span>
                <p>
                  {v.lead}
                  <small>{v.sub}</small>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ④ 料金 */}
      <section className="s" id="pricing">
        <div className="wrap">
          <Eyebrow>Pricing</Eyebrow>
          <SplitH2 parts={[{ text: "One " }, { text: "plan", italic: true }]} />
          <div className="price-card">
            <div className="price-main rv" style={d(0)}>
              <span className="plan">STANDARD PLAN</span>
              <div className="yen">
                ¥{yen(plan.priceInTaxYen)}
                <small>税込</small>
              </div>
              <Cta />
            </div>
            <div className="specs rv" style={d(1)}>
              {SPECS.map((s, k) => (
                <div key={s.label} className="spec rv" style={d(k)}>
                  <div className="num">
                    {s.num}
                    <i>{s.unit}</i>
                  </div>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ul className="incl">
            {INCLUDED.map((x, k) => (
              <li key={x.label} className="rv" style={d(k)}>
                <Icon>{x.icon}</Icon>
                {x.label}
              </li>
            ))}
          </ul>
          <div className="opts">
            {WCC_EXTRAS.map((e, k) => (
              <div key={e.id} className="opt rv" style={d(k)}>
                <span>{EXTRA_LABEL[e.id] ?? e.name}</span>
                <b>{extraPrice(e)}</b>
              </div>
            ))}
          </div>
          <p className="note">交通費は含まれていません。場所や式場によっては宿泊が必要になる場合があります</p>
        </div>
      </section>

      {/* ⑤ ご利用の流れ */}
      <section className="s dark" id="flow">
        <div className="wrap">
          <Eyebrow>Flow</Eyebrow>
          <SplitH2 parts={[{ text: `${FLOW.length} ` }, { text: "steps", italic: true }]} />
          <ol className="flow">
            {FLOW.map((f, k) => (
              <li key={f.label} className={`step${f.key ? " key" : ""}`} style={d(k)}>
                <span className="dot">
                  <Icon>{f.icon}</Icon>
                </span>
                <span className="txt">
                  <span className="no">{String(k + 1).padStart(2, "0")}</span>
                  <p>{f.label}</p>
                </span>
              </li>
            ))}
          </ol>
          <div className="phase">
            {["相談・見積もり", "契約", "準備〜当日"].map((p, k) => (
              <span key={p} className="rv" style={d(k)}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ よくある質問（文言は lib/home-faq.ts が正） */}
      <section className="s light" id="faq">
        <div className="wrap">
          <Eyebrow>FAQ</Eyebrow>
          <SplitH2 parts={[{ text: "Q " }, { text: "&", italic: true }, { text: " A" }]} />
          <div className="faq">
            {HOME_FAQ_GROUPS.map((g) => (
              <div key={g.id} className="faq-col">
                {g.items.map((it) => (
                  <details key={it.q} className="rv" style={d(faqIndex++)}>
                    <summary>
                      {it.q}
                      <i aria-hidden="true" />
                    </summary>
                    <p>{it.a}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑦ 最後の相談 */}
      <section className="end" id="contact">
        <video
          className="ghost"
          src={`${V}/bg-loop.mp4`}
          poster={`${P}/realmoment-bg-loop.jpg`}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
        />
        <div className="wrap">
          <Eyebrow>Contact</Eyebrow>
          <SplitH2 parts={[{ text: "Let's " }, { text: "talk", italic: true }]} />
          <div>
            <div className="slots rv" style={d(3)}>
              <span className="d" aria-hidden="true">
                {Array.from({ length: CAPACITY_PER_MONTH }, (_, k) => (
                  <i key={k} style={{ ["--k" as string]: k }} />
                ))}
              </span>
              <span>{slotsLabel}</span>
            </div>
          </div>
          <Cta className="cta rv" style={d(4)} />
        </div>
      </section>

      <footer className="hb3-footer">
        <div className="wrap">
          <div className="ft">
            <span className="logo">For Your Wedding Day</span>
            <nav aria-label="法務情報">
              <Link href={LEGAL_PAGE_HREF.tokushoho}>特定商取引法に基づく表記</Link>
              <Link href={LEGAL_PAGE_HREF.privacy}>プライバシーポリシー</Link>
              <Link href={LEGAL_PAGE_HREF.terms}>利用規約</Link>
            </nav>
          </div>
          <p className="copy">© {new Date().getFullYear()} For Your Wedding Day. All rights reserved.</p>
        </div>
      </footer>

      {/* スマホ：FV を過ぎたら下に相談ボタン */}
      <div className="dock">
        <Cta />
      </div>

      <HomeB3Motion rootId={ROOT_ID} />
    </div>
  );
}
