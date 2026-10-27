"use client";

import { useEffect, useRef } from "react";
import { Syne } from "next/font/google";

const display = Syne({ subsets: ["latin"], weight: ["500"] });

const lines = [
  { text: "Hi, I’m", name: false },
  { text: "Sebastian Bernal", name: true },
];

const PAD = 48;
const MAX = 140;

const built = lines.map((line) => {
  const len = line.text.length;
  let pos = 0;
  const words = line.text.split(" ").map((word) =>
    Array.from(word)
      .map((c) => ({ c, o: pos++ - (len - 1) / 2 }))
      .concat((pos++, [])),
  );
  return { name: line.name, words };
});

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
};

export default function HeroTitle() {
  const root = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = root.current;
    const rule = bar.current;
    const line = wrap.current;
    const canvas = cv.current;
    if (!node || !rule || !line || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const letters = Array.from(node.querySelectorAll<HTMLElement>("[data-l]"));
    const total = letters.length;
    const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const easing = "cubic-bezier(0.2, 0.7, 0.2, 1)";

    letters.forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, filter: "blur(8px)", transform: "scale(0.6)" },
          { opacity: 1, filter: "blur(0px)", transform: "scale(1)" },
        ],
        { duration: 800, delay: i * 45, easing, fill: "backwards" },
      );
    });

    line.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
      duration: 900,
      delay: total * 45,
      easing,
      fill: "backwards",
    });

    let frame = 0;

    const update = () => {
      frame = 0;
      const p = clamp(window.scrollY / (window.innerHeight * 0.6));

      letters.forEach((el, i) => {
        const s = el.firstElementChild as HTMLElement;
        const o = Number(el.dataset.o);
        const local = clamp(p * 1.5 - (i / total) * 0.5);
        s.style.opacity = String(1 - local * 0.9);
        s.style.filter = `blur(${local * 5}px)`;
        s.style.transform = `translateX(${o * local * 10}px) scale(${1 - local * 0.3})`;
      });

      rule.style.transform = `scaleX(${1 - p})`;
      rule.style.opacity = String(1 - p);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const dots: Dot[] = [];
    let pr = 0;
    let last = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = node.clientWidth + PAD * 2;
      h = node.clientHeight + PAD * 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = getComputedStyle(node).color;

      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.life += dt;
        if (d.life >= d.max) {
          dots.splice(i, 1);
          continue;
        }
        const k = d.life / d.max;
        const damp = 1 - dt * 1.8;
        d.vx *= damp;
        d.vy *= damp;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        ctx.globalAlpha = (1 - k) * (1 - k) * 0.75;
        ctx.fillRect(d.x, d.y, d.size, d.size);
      }

      ctx.globalAlpha = 1;
      pr = dots.length ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target = e.target as HTMLElement;
      if (!target.closest("[data-l]")) return;

      const box = node.getBoundingClientRect();
      const count = Math.random() < 0.5 ? 1 : 2;

      for (let i = 0; i < count; i++) {
        if (dots.length >= MAX) break;
        const angle = rand(0, Math.PI * 2);
        const speed = rand(14, 42);
        dots.push({
          x: e.clientX - box.left + PAD + rand(-10, 10),
          y: e.clientY - box.top + PAD + rand(-10, 10),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: rand(0.6, 1.1),
          size: Math.random() < 0.7 ? 1.5 : 2.5,
        });
      }

      if (!pr) {
        last = performance.now();
        pr = requestAnimationFrame(loop);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(node);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    node.addEventListener("pointermove", onMove);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      node.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      if (pr) cancelAnimationFrame(pr);
    };
  }, []);

  return (
    <div ref={root} className="relative mx-auto mt-5 max-w-2xl sm:mt-6">
      <h1
        aria-label="Hi, I’m Sebastian Bernal"
        className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl"
      >
        {built.map((line, l) => (
          <span
            key={l}
            aria-hidden="true"
            className={`block ${line.name ? `${display.className} font-medium` : ""}`}
          >
            {line.words.map((word, w) => (
              <span key={w}>
                {w > 0 && " "}
                <span className="inline-block whitespace-nowrap">
                  {word.map(({ c, o }, k) => (
                    <span key={k} data-l data-o={o} className="inline-block">
                      <span className="inline-block will-change-transform">
                        <span
                          className={`inline-block cursor-default ${
                            line.name
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {c}
                        </span>
                      </span>
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        ))}
      </h1>
      <span
        ref={wrap}
        aria-hidden="true"
        className="mx-auto mt-5 block w-20 origin-center"
      >
        <span
          ref={bar}
          className="block h-px origin-center bg-slate-400/60 dark:bg-slate-500/60"
        />
      </span>
      <canvas
        ref={cv}
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{ left: -PAD, top: -PAD }}
      />
    </div>
  );
}
