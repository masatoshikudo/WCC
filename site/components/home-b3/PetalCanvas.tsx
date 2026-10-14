"use client";

import { useEffect, useRef } from "react";

/**
 * FV の花吹雪（一部ハート）。奥・中・手前の3層。
 *
 * 落ち方は「フラッター（ひらひら落下）」の観測結果に合わせる（Andersen, Pesavento & Wang 2005, JFM）
 *  ・横に滑空しながら左右に往復する。横の速さは滑空の途中が最大
 *  ・往復の端で動きがほぼ止まり、少し浮き上がってから、くるっと向きを変える
 *  ・縦の速さは横の2倍の周期で波打つ（滑空の途中で速く、端で遅い〜わずかに上昇）
 *  ・回転は端で一気に、滑空中は浅い角度のまま
 */

const PETAL = ["#ffffff", "#fdf3ef", "#f6ddd4", "#f0c9bc", "#e9b8a8"]; // 白〜淡いピンク
const HEART = ["#f0c9bc", "#e9b8a8", "#e4a593", "#ffffff"];
const NEAR = ["#f0c9bc", "#e9b8a8", "#e4a593", "#f6ddd4"];
const HEART_RATE = 0.25; // 全体の約1/4をハートに

type LayerKey = "far" | "mid" | "near";
type Layer = {
  /** 大きさ倍率（0 は画面サイズ基準の巨大サイズ） */
  scale: number;
  /** 平均の落ちる速さ(px/s) */
  vm: number;
  /** 横の速さの最大（平均落下の何倍） */
  swing: number;
  /** 往復の速さ(rad/s) */
  w: [number, number];
  /** 1秒あたりに降る数 [SP, PC] */
  rate: [number, number] | null;
  max: number;
};
const LAYERS: Record<LayerKey, Layer> = {
  far: { scale: 0.38, vm: 20, swing: 1.6, w: [1.0, 1.6], rate: [7, 12], max: 220 },
  mid: { scale: 1, vm: 52, swing: 1.8, w: [1.6, 2.4], rate: [5, 9], max: 420 },
  near: { scale: 0, vm: 820, swing: 1.15, w: [2.8, 3.6], rate: null, max: 3 },
};

type P = {
  heart: boolean;
  x: number;
  y: number;
  lx: number;
  ly: number;
  s: number;
  vm: number;
  U: number;
  w: number;
  th: number;
  drift: number;
  base: number;
  tilt: number;
  c: string;
  life: number;
};

const R = (a: number, b: number) => a + Math.random() * (b - a);

export function PetalCanvas({ heroId }: { heroId: string }) {
  const farRef = useRef<HTMLCanvasElement>(null);
  const midRef = useRef<HTMLCanvasElement>(null);
  const nearRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = document.getElementById(heroId);
    const canvases = { far: farRef.current, mid: midRef.current, near: nearRef.current };
    if (!hero || !canvases.far || !canvases.mid || !canvases.near) return;

    const ctx = {
      far: canvases.far.getContext("2d")!,
      mid: canvases.mid.getContext("2d")!,
      near: canvases.near.getContext("2d")!,
    };
    const parts: Record<LayerKey, P[]> = { far: [], mid: [], near: [] };
    let W = 0;
    let H = 0;
    let running = true;
    let last = performance.now();
    let raf = 0;

    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = hero.clientWidth;
      H = hero.clientHeight;
      (Object.keys(canvases) as LayerKey[]).forEach((k) => {
        const cv = canvases[k]!;
        cv.width = W * dpr;
        cv.height = H * dpr;
        ctx[k].setTransform(dpr, 0, 0, dpr, 0, 0);
      });
    };
    size();
    window.addEventListener("resize", size);

    const make = (k: LayerKey, x: number, y: number, lx = 0, ly = 0): P => {
      const L = LAYERS[k];
      const heart = Math.random() < HEART_RATE;
      const pal = k === "near" ? NEAR : heart ? HEART : PETAL;
      const vm = L.vm * R(0.75, 1.2);
      return {
        heart,
        x,
        y,
        lx, // 打ち上げの勢い（時間とともに消える）
        ly,
        s: L.scale
          ? (heart ? R(18, 26) : R(10, 18)) * L.scale * (W < 640 ? 0.8 : 1)
          : R(0.32, 0.55) * Math.max(W, H),
        vm,
        U: vm * L.swing * R(0.8, 1.2),
        w: R(L.w[0], L.w[1]),
        th: R(0, 6.28),
        drift: R(-0.25, 0.25) * vm,
        base: heart ? R(-0.3, 0.3) : R(0, 6.28),
        tilt: heart ? 0.35 : R(0.45, 0.7),
        c: pal[(Math.random() * pal.length) | 0],
        life: 1,
      };
    };

    const shapePetal = (c: CanvasRenderingContext2D, s: number) => {
      c.moveTo(0, -s * 0.5);
      c.bezierCurveTo(s * 0.55, -s * 0.5, s * 0.55, s * 0.35, 0, s * 0.5);
      c.bezierCurveTo(-s * 0.55, s * 0.35, -s * 0.55, -s * 0.5, 0, -s * 0.5);
    };
    const shapeHeart = (c: CanvasRenderingContext2D, s: number) => {
      const h = s * 0.5;
      c.moveTo(0, h * 0.9);
      c.bezierCurveTo(-h * 1.25, h * 0.05, -h * 0.95, -h * 1.05, 0, -h * 0.35);
      c.bezierCurveTo(h * 0.95, -h * 1.05, h * 1.25, h * 0.05, 0, h * 0.9);
    };
    const draw = (c: CanvasRenderingContext2D, p: P) => {
      const sn = Math.sin(p.th);
      c.save();
      c.translate(p.x, p.y);
      // 滑空中は浅い傾きのまま、往復の端で一気に向きが変わる
      c.rotate(p.base + p.tilt * Math.tanh(4 * sn));
      // 端では花びらが起き上がって細く見える
      c.scale(1, p.heart ? 0.8 + 0.2 * Math.abs(sn) : 0.35 + 0.65 * Math.abs(sn));
      c.fillStyle = p.c;
      c.globalAlpha = 0.92 * p.life;
      c.beginPath();
      if (p.heart) shapeHeart(c, p.s);
      else shapePetal(c, p.s);
      c.fill();
      c.globalAlpha = 0.3 * p.life;
      c.strokeStyle = "#b08f84";
      c.lineWidth = 0.6;
      c.stroke();
      c.restore();
    };
    const move = (p: P, dt: number) => {
      p.th += p.w * dt;
      const u = p.U * Math.sin(p.th); // 横：滑空の途中で最大、端でほぼ0
      const v = p.vm * (1 - 1.6 * Math.cos(2 * p.th)); // 縦：横の2倍の周期。端では少し浮く
      // 打ち上げの勢いは空気抵抗で弱まり、重力で下向きへ
      const c = 1.3;
      const k = Math.exp(-c * dt);
      p.lx *= k;
      p.ly = p.ly * k + ((p.ly < 0 ? 160 : 0) / c) * (1 - k);
      if (p.ly > 0) p.ly *= k;
      p.x += (p.drift + u + p.lx) * dt;
      p.y += (v + p.ly) * dt;
    };
    const step = (k: LayerKey, dt: number) => {
      const L = LAYERS[k];
      if (L.rate && Math.random() < L.rate[W < 640 ? 0 : 1] * dt) parts[k].push(make(k, R(-20, W + 20), -20));
      const c = ctx[k];
      c.clearRect(0, 0, W, H);
      const edge = k === "near" ? Math.max(W, H) * 0.6 : 60;
      for (const p of parts[k]) {
        move(p, dt);
        if (p.y > H - 30 && k !== "near") p.life -= dt * 2;
        draw(c, p);
      }
      parts[k] = parts[k].filter((p) => p.life > 0 && p.y < H + edge && p.x > -edge && p.x < W + edge);
      if (parts[k].length > L.max) parts[k].splice(0, parts[k].length - L.max);
    };

    // 手前：一定の間隔で1枚ずつ、画面の上の外から入って一瞬で横切る
    let nearT = 0.2;
    const spawnNear = () => parts.near.push(make("near", R(-0.1, 1.1) * W, -Math.max(W, H) * 0.45));

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (running) {
        nearT -= dt;
        if (nearT <= 0) {
          nearT = R(3.5, 6);
          spawnNear();
        }
        step("far", dt);
        step("mid", dt);
        step("near", dt);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // 奥の層は最初から画面に散らしておく
    for (let i = 0; i < (W < 640 ? 40 : 80); i++) parts.far.push(make("far", R(0, W), R(0, H)));

    const burst = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const a = R(-Math.PI * 0.92, -Math.PI * 0.08);
        const sp = R(320, 760);
        parts.mid.push(make("mid", x + R(-10, 10), y + R(-6, 6), Math.cos(a) * sp, Math.sin(a) * sp));
      }
    };
    // 動画のピルが開くタイミングで、左右の下から舞い上がる
    const t = window.setTimeout(() => {
      burst(W * 0.18, H * 0.98, W < 640 ? 35 : 60);
      burst(W * 0.82, H * 0.98, W < 640 ? 35 : 60);
    }, 1000);
    // FV をタップ／クリックした場所から舞い上がる
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("a,button")) return;
      const r = hero.getBoundingClientRect();
      burst(e.clientX - r.left, e.clientY - r.top, 26);
    };
    hero.addEventListener("pointerdown", onDown);
    // FV が画面外のときは止める
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      last = performance.now();
    });
    io.observe(hero);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener("resize", size);
      hero.removeEventListener("pointerdown", onDown);
      io.disconnect();
    };
  }, [heroId]);

  return (
    <>
      <canvas ref={farRef} id="confetti-far" className="cf" aria-hidden="true" />
      <canvas ref={midRef} id="confetti" className="cf" aria-hidden="true" />
      <canvas ref={nearRef} id="confetti-near" className="cf" aria-hidden="true" />
    </>
  );
}
