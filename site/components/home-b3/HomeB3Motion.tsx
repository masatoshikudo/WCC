"use client";

import { useEffect } from "react";

/**
 * トップ（B3）の動きをまとめて付ける。描画はせず、サーバーで出した DOM に振る舞いだけ足す。
 *  ・欄が画面に入ったら .in（見出しの文字・カード・線などが出る）
 *  ・料金の数字をカウントアップ
 *  ・作例の動画は画面に入ったものだけ再生／矢印で送る
 *  ・スマホ下部の相談ボタンは FV を過ぎたら出し、最後の相談欄では隠す
 *  ・FV 大見出しの光のグラデーションを単語ごとに位置合わせ
 *  ・ホバー：見出しが波打つ／ボタンが吸い寄せられる／作例が傾く／FV の動画が逆に動く
 */
export function HomeB3Motion({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    // 画面遷移で来たときはインラインの script が動かないので、ここでも付ける
    root.classList.add("js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof HTMLElementEventMap>(
      el: HTMLElement | Document | Window,
      type: K,
      fn: (e: HTMLElementEventMap[K]) => void,
    ) => {
      el.addEventListener(type, fn as EventListener);
      cleanups.push(() => el.removeEventListener(type, fn as EventListener));
    };

    // ---------- 作例：画面に入った動画だけ再生 ----------
    const vio = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            if (!v.src && v.dataset.src) v.src = v.dataset.src;
            v.play().catch(() => {});
          } else v.pause();
        }),
      { threshold: 0.5 },
    );
    root.querySelectorAll<HTMLVideoElement>(".clip video").forEach((v) => vio.observe(v));
    cleanups.push(() => vio.disconnect());

    // ---------- 作例：矢印で送る ----------
    const reel = root.querySelector<HTMLElement>(".reel");
    root.querySelectorAll<HTMLButtonElement>(".arrows button").forEach((b) =>
      on(b, "click", () => {
        const clip = reel?.querySelector<HTMLElement>(".clip");
        if (reel && clip) reel.scrollBy({ left: Number(b.dataset.dir) * (clip.offsetWidth + 16), behavior: "smooth" });
      }),
    );

    // ---------- スマホ下部の相談ボタン ----------
    const dock = root.querySelector<HTMLElement>(".dock");
    const hero = root.querySelector<HTMLElement>(".hero");
    const end = root.querySelector<HTMLElement>("section.end");
    if (dock && hero && end) {
      let pastHero = false;
      let atEnd = false;
      const sync = () => dock.classList.toggle("on", pastHero && !atEnd);
      const a = new IntersectionObserver(([e]) => {
        pastHero = !e.isIntersecting;
        sync();
      });
      const b = new IntersectionObserver(([e]) => {
        atEnd = e.isIntersecting;
        sync();
      });
      a.observe(hero);
      b.observe(end);
      cleanups.push(() => {
        a.disconnect();
        b.disconnect();
      });
    }

    // ---------- 欄が画面に入ったら .in ----------
    const count = (sec: Element) => {
      if (reduce) return;
      sec.querySelectorAll(".yen,.spec .num").forEach((el) => {
        const t = el.firstChild;
        if (!t || t.nodeType !== 3) return;
        const raw = t.textContent ?? "";
        const m = raw.match(/[\d,]+/);
        if (!m || m.index === undefined) return;
        const endN = Number(m[0].replace(/,/g, ""));
        const pre = raw.slice(0, m.index);
        const post = raw.slice(m.index + m[0].length);
        const dur = 1400;
        const st = performance.now();
        const stepFn = (now: number) => {
          const p = Math.min(1, (now - st) / dur);
          const v = Math.round(endN * (1 - Math.pow(1 - p, 4)));
          t.textContent = pre + v.toLocaleString("ja-JP") + post;
          if (p < 1) requestAnimationFrame(stepFn);
        };
        t.textContent = pre + "0" + post;
        requestAnimationFrame(stepFn);
      });
    };
    const timers: number[] = [];
    const ob = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          const t = e.target;
          t.classList.add("in");
          ob.unobserve(t);
          count(t);
          timers.push(window.setTimeout(() => t.classList.add("settled"), 3200));
        }),
      { threshold: 0.18 },
    );
    root.querySelectorAll("section.s, section.end").forEach((s) => ob.observe(s));
    cleanups.push(() => {
      ob.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    });
    // 手紙：読む位置（画面の下から35%）を通った行から、1行ずつ浮かび上がらせる
    const lo = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("read");
          lo.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -35% 0px" },
    );
    root.querySelectorAll(".letter .ln").forEach((l) => lo.observe(l));
    cleanups.push(() => lo.disconnect());
    // 出し終わった要素は、ホバー用の速い動きに切り替える
    on(root, "transitionend", (e) => {
      const el = e.target as HTMLElement;
      if (el.classList?.contains("rv") && e.propertyName === "opacity" && el.closest(".in")) el.classList.remove("rv");
    });

    // ---------- FV 大見出しの光のグラデーション位置合わせ ----------
    const big = root.querySelector<HTMLElement>(".big");
    if (big) {
      const ws = Array.from(big.querySelectorAll<HTMLElement>(".w"));
      // transform の影響を受けない offset で、見出し全体に対する各単語の位置を求める
      const pos = (el: HTMLElement) => {
        const a = el.getBoundingClientRect();
        const b = big.getBoundingClientRect();
        // 立ち上がりアニメ中の translate を打ち消すため、offsetTop 差分で縦位置を取る
        let y = 0;
        let n: HTMLElement | null = el;
        while (n && n !== big && n.offsetParent) {
          y += n.offsetTop;
          n = n.offsetParent as HTMLElement;
          if (n && !big.contains(n)) {
            y -= big.offsetTop;
            break;
          }
        }
        return [a.left - b.left, y] as const;
      };
      const fit = () => {
        const bw = big.offsetWidth;
        const bh = big.offsetHeight;
        ws.forEach((w) => {
          const [x, y] = pos(w);
          w.style.backgroundSize = `160px 160px, ${bw}px ${bh}px`;
          w.style.backgroundPosition = `0 0, ${-x}px ${-y}px`;
        });
      };
      fit();
      on(window, "resize", fit);
      document.fonts?.ready.then(fit);
      // ピルが開くと単語の位置が動くので、開いている間は追従させる
      const t0 = performance.now();
      let raf = 0;
      const loop = (now: number) => {
        fit();
        if (now - t0 < 3000) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanups.push(() => cancelAnimationFrame(raf));
    }

    // ---------- 見出しにカーソルを乗せると文字が波打つ ----------
    root.querySelectorAll<HTMLElement>(".h2").forEach((h) => {
      on(h, "mouseenter", () => {
        if (reduce) return;
        h.classList.remove("wave");
        void h.offsetWidth;
        h.classList.add("wave");
      });
      on(h, "animationend", () => h.classList.remove("wave"));
    });

    if (!reduce && !window.matchMedia("(hover:none)").matches) {
      // ボタンがカーソルに少し吸い寄せられる
      root.querySelectorAll<HTMLElement>(".cta").forEach((b) => {
        on(b, "mousemove", (e) => {
          const r = b.getBoundingClientRect();
          b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        });
        on(b, "mouseleave", () => (b.style.transform = ""));
      });
      // FV：動画のピルがカーソルと逆に動く
      const pills = Array.from(root.querySelectorAll<HTMLElement>(".pill"));
      if (hero) {
        on(hero, "mousemove", (e) => {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          pills.forEach((p, k) => (p.style.translate = `${-x * (k ? 18 : 12)}px ${-y * (k ? 12 : 8)}px`));
        });
        on(hero, "mouseleave", () => pills.forEach((p) => (p.style.translate = "")));
      }
      // 作例：カードがカーソルの方へ少し傾く
      root.querySelectorAll<HTMLElement>(".clip").forEach((c) => {
        on(c, "mousemove", (e) => {
          const r = c.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = `perspective(900px) translateY(-8px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
        });
        on(c, "mouseleave", () => (c.style.transform = ""));
      });
    }

    return () => cleanups.forEach((f) => f());
  }, [rootId]);

  return null;
}
