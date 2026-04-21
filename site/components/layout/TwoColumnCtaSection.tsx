import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type TwoColumnCtaSectionProps = {
  leftAside: ReactNode;
  children: ReactNode;
  className?: string;
  rightClassName?: string;
};

/** お問い合わせ・予約フロー共通の2カラム（右カラムのラッパー幅を統一） */
export function TwoColumnCtaSection({
  leftAside,
  children,
  className,
  rightClassName,
}: TwoColumnCtaSectionProps) {
  return (
    <section
      className={cn("mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start", className)}
    >
      {leftAside}
      <div className={cn("min-w-0", rightClassName)}>{children}</div>
    </section>
  );
}
