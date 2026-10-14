/**
 * `/book` の `BookFlow` 遅延読み込み中プレースホルダー（B3 の見た目に合わせた骨組み）
 */
export function BookFlowLoading() {
  return (
    <div className="wrap" aria-busy="true" aria-label="読み込み中" style={{ minHeight: "60vh" }}>
      <div style={{ display: "grid", gap: 14, maxWidth: 760, marginLeft: "auto", opacity: 0.5 }}>
        {[180, 140, 260].map((h) => (
          <div key={h} style={{ height: h, borderRadius: 24, background: "rgba(255,255,255,.55)" }} />
        ))}
      </div>
    </div>
  );
}
