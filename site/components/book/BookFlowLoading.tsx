/**
 * `/book` の `BookFlow` 遅延読み込み中プレースホルダー（CLS 抑制のため外枠・余白を本番に合わせる）
 */
export function BookFlowLoading() {
  return (
    <div className="mx-auto w-full max-w-content px-4 py-10 md:px-6 md:py-12 lg:min-h-[calc(100svh-6rem)] lg:px-8 lg:py-10">
      <div className="animate-pulse space-y-6" aria-busy="true" aria-label="読み込み中">
        <div className="h-9 w-64 max-w-full rounded-sm bg-ink/10" />
        <div className="h-20 max-w-2xl rounded-sm bg-ink/10" />
        <div className="h-8 w-56 max-w-full rounded-sm bg-ink/10" />
        <div className="mt-8 max-w-lg space-y-4">
          <div className="h-12 w-full rounded-sm border border-hairline bg-canvas" />
          <div className="h-12 w-full rounded-sm border border-hairline bg-canvas" />
          <div className="h-12 w-full rounded-sm border border-hairline bg-canvas" />
        </div>
      </div>
    </div>
  );
}
