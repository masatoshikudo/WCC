import type { ReactNode } from "react";

import { WCC_SIDE_COLUMN_IMAGE_ALT, WCC_SIDE_COLUMN_IMAGE_URL } from "@/lib/site-media";

type SideColumnVisualPanelProps = {
  eyebrow: string;
  children: ReactNode;
};

/** 左カラム共有画像 + 英字ラベル + 任意の本文（箇条書き等） */
export function SideColumnVisualPanel({ eyebrow, children }: SideColumnVisualPanelProps) {
  return (
    <article className="bg-canvas-subtle p-4 md:p-5">
      <div className="relative overflow-hidden">
        <img
          src={WCC_SIDE_COLUMN_IMAGE_URL}
          alt={WCC_SIDE_COLUMN_IMAGE_ALT}
          className="aspect-[4/5] w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-4 space-y-4">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
          {eyebrow}
        </p>
        {children}
      </div>
    </article>
  );
}
