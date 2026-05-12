import type { ReactNode } from "react";
import Image from "next/image";

import { WCC_SIDE_COLUMN_IMAGE_ALT, WCC_SIDE_COLUMN_IMAGE_URL } from "@/lib/site-media";

type SideColumnVisualPanelProps = {
  eyebrow?: string;
  children?: ReactNode;
};

/** 左カラム共有画像 + 英字ラベル + 任意の本文（箇条書き等） */
export function SideColumnVisualPanel({ eyebrow, children }: SideColumnVisualPanelProps) {
  const hasMeta = Boolean(eyebrow?.trim()) || Boolean(children);

  return (
    <article className="flex h-full flex-col p-4 md:p-5">
      <div className="relative mx-auto aspect-[9/16] w-full overflow-hidden lg:w-[80%]">
        <Image
          src={WCC_SIDE_COLUMN_IMAGE_URL}
          alt={WCC_SIDE_COLUMN_IMAGE_ALT}
          fill
          sizes="(min-width: 1024px) 480px, 90vw"
          className="object-cover"
        />
      </div>
      {hasMeta ? (
        <div className="mt-4 space-y-4">
          {eyebrow?.trim() ? (
            <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              {eyebrow}
            </p>
          ) : null}
          {children}
        </div>
      ) : null}
    </article>
  );
}
