import type { ReactNode } from "react";

type Part = { text: string; italic?: boolean };

/**
 * 英字の大見出しを1文字ずつの <span> に分けて出す（画面に入ると1文字ずつ立ち上がる演出用）。
 * 分割はサーバー側で済ませ、クライアントで DOM を組み替えない。
 */
export function SplitH2({ parts, className = "h2" }: { parts: Part[]; className?: string }) {
  let i = 0;
  const chars = (text: string): ReactNode[] =>
    Array.from(text).map((c, k) => {
      if (c === " ") return " ";
      const n = i++;
      return (
        <span key={`${n}-${k}`} className="ch">
          <span style={{ ["--i" as string]: n }}>{c}</span>
        </span>
      );
    });

  const label = parts.map((p) => p.text).join("");
  return (
    <h2 className={className} lang="en" aria-label={label}>
      {parts.map((p, k) =>
        p.italic ? (
          <em key={k} aria-hidden="true">
            {chars(p.text)}
          </em>
        ) : (
          <span key={k} aria-hidden="true">
            {chars(p.text)}
          </span>
        ),
      )}
    </h2>
  );
}
