"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const MENU = [
  { href: "/#works", label: "作例" },
  { href: "/#values", label: "大切にすること" },
  { href: "/#pricing", label: "料金" },
  { href: "/#flow", label: "ご利用の流れ" },
  { href: "/#faq", label: "よくある質問" },
] as const;

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

/** B3 デザインのヘッダー（トップ・ご相談ページ）：左にメニュー、中央にロゴ、右に Instagram・お問い合わせ */
export function HomeB3Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="hdr">
      <button
        type="button"
        className={`chip${open ? " open" : ""}`}
        aria-expanded={open}
        aria-controls="hb3-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <b />
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      {/* 正式ロゴ：PC は横長（シンボル＋ロゴタイプ）、スマホはシンボルのみ */}
      <Link className="logo logo-img" href="/" aria-label="For Your Wedding Day トップへ">
        <Image src="/FYWD_logo_PC.png" alt="For Your Wedding Day" width={1600} height={329} className="logo-pc" priority />
        <Image src="/FYWD_logo_SP.png" alt="For Your Wedding Day" width={1600} height={1600} className="logo-sp" priority />
      </Link>
      <nav className="icons" aria-label="SNS・お問い合わせ">
        {instagramUrl ? (
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 2c-2.7 0-3 0-4.1.1C4.3 2.3 2.3 4.3 2.1 7.9 2 9 2 9.3 2 12s0 3 .1 4.1c.2 3.6 2.2 5.6 5.8 5.8 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c3.6-.2 5.6-2.2 5.8-5.8.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.2-3.6-2.2-5.6-5.8-5.8C15 2 14.7 2 12 2Zm0 1.8c2.7 0 3 0 4 .1 2.6.1 3.9 1.4 4 4 .1 1 .1 1.3.1 4s0 3-.1 4c-.1 2.6-1.4 3.9-4 4-1 .1-1.3.1-4 .1s-3 0-4-.1c-2.6-.1-3.9-1.4-4-4-.1-1-.1-1.3-.1-4s0-3 .1-4c.1-2.6 1.4-3.9 4-4 1-.1 1.3-.1 4-.1Z" />
            </svg>
          </a>
        ) : null}
        <Link href="/book" aria-label="お問い合わせ">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 5h18v14H3V5Zm2 2v.5l7 4.6 7-4.6V7H5Zm14 2.9-7 4.6-7-4.6V17h14V9.9Z" />
          </svg>
        </Link>
      </nav>

      <div id="hb3-menu" className={`menu${open ? " open" : ""}`} hidden={!open}>
        <ul>
          {MENU.map((m, k) => (
            <li key={m.href} style={{ ["--k" as string]: k }}>
              <a href={m.href} onClick={() => setOpen(false)}>
                {m.label}
              </a>
            </li>
          ))}
        </ul>
        <Link className="cta" href="/book" onClick={() => setOpen(false)}>
          まず相談する
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
