"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

const greetings = [
  "Say hi",
  "Hola",
  "Bonjour",
  "Ciao",
  "こんにちは",
  "Hallo",
  "Olá",
  "Привет",
  "你好",
  "안녕하세요",
  "مرحبا",
  "नमस्ते",
  "สวัสดี",
  "Merhaba",
  "Hej",
  "Hei",
  "Dzień dobry",
  "Γεια σου",
  "שלום",
  "Xin chào",
  "سلام",
  "Habari",
  "Bună",
  "Ahoj",
  "Halo",
  "Cześć",
  "Jambo",
];

const LAYERS = [
  { z: 6, cls: "opacity-[0.22] dark:opacity-[0.5]", blur: 0 },
  { z: 12, cls: "opacity-[0.18] dark:opacity-[0.42]", blur: 0 },
  { z: 18, cls: "opacity-[0.14] dark:opacity-[0.34]", blur: 0.4 },
  { z: 26, cls: "opacity-[0.1] dark:opacity-[0.24]", blur: 0.8 },
  { z: 36, cls: "opacity-[0.07] dark:opacity-[0.16]", blur: 1.4 },
  { z: 48, cls: "opacity-[0.04] dark:opacity-[0.09]", blur: 2.2 },
];

const GHOST: CSSProperties = {
  textShadow: "0 0 20px currentColor",
  WebkitTextFillColor: "transparent",
};

const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

type Pt = { x: number; y: number };
type LetterState = {
  y: number;
  z: number;
  s: number;
  rx: number;
  ry: number;
  dirty: boolean;
};

export default function HiBanner({ href }: { href: string }) {
  const [i, setI] = useState(0);
  const link = useRef<HTMLAnchorElement>(null);
  const stage = useRef<HTMLSpanElement>(null);
  const wordEl = useRef<HTMLSpanElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const mouse = useRef<Pt | null>(null);
  const tilt = useRef({ rx: 0, ry: 0 });
  const word = greetings[i];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % greetings.length), 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const host = link.current;
    const stg = stage.current;
    if (!host || !stg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let prev = 0;
    const centers: { x: number; y: number; h: number }[] = [];
    const cur: LetterState[] = [];

    const measure = () => {
      const w = wordEl.current;
      if (!w) return;
      letters.current.forEach((el, k) => {
        const box = el?.parentElement;
        if (!el || !box) return;
        centers[k] = {
          x: w.offsetLeft + box.offsetLeft + box.offsetWidth / 2,
          y: w.offsetTop + box.offsetTop + box.offsetHeight / 2,
          h: box.offsetHeight,
        };
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(stg);

    const tick = (time: number) => {
      if (!running) return;
      const dt = prev ? Math.min(50, time - prev) : 16.667;
      prev = time;
      const k = dt / 16.667;
      const m = mouse.current;

      const sr = m ? stg.getBoundingClientRect() : null;

      let trx = Math.cos(time * 0.0006) * 1.1;
      let try_ = Math.sin(time * 0.0008) * 2.2;
      if (m && sr) {
        const nx = clamp1((m.x - (sr.left + sr.width / 2)) / (sr.width / 2));
        const ny = clamp1((m.y - (sr.top + sr.height / 2)) / (sr.height / 2));
        try_ += nx * 12;
        trx += -ny * 7;
      }
      const a = 1 - Math.pow(0.92, k);
      const t = tilt.current;
      t.rx += (trx - t.rx) * a;
      t.ry += (try_ - t.ry) * a;
      if (wordEl.current) {
        wordEl.current.style.transform = `rotateX(${t.rx.toFixed(3)}deg) rotateY(${t.ry.toFixed(3)}deg)`;
      }

      const b = 1 - Math.pow(0.88, k);
      letters.current.forEach((el, n) => {
        const c = centers[n];
        if (!el || !c) return;
        const s =
          cur[n] ?? (cur[n] = { y: 0, z: 0, s: 1, rx: 0, ry: 0, dirty: false });
        let ty = 0;
        let tz = 0;
        let ts = 1;
        let tlx = 0;
        let tly = 0;
        if (m && sr) {
          const dx = m.x - (sr.left + c.x);
          const dy = m.y - (sr.top + c.y);
          const d = Math.hypot(dx, dy);
          const f = Math.max(0, 1 - d / (c.h * 1.8));
          ty = -f * c.h * 0.2;
          tz = f * 70;
          ts = 1 + f * 0.3;
          tly = clamp1(dx / (c.h * 1.2)) * f * 22;
          tlx = clamp1(-dy / (c.h * 1.2)) * f * 14;
        }
        s.y += (ty - s.y) * b;
        s.z += (tz - s.z) * b;
        s.s += (ts - s.s) * b;
        s.rx += (tlx - s.rx) * b;
        s.ry += (tly - s.ry) * b;
        const moving =
          Math.abs(ty - s.y) > 0.05 ||
          Math.abs(tz - s.z) > 0.05 ||
          Math.abs(ts - s.s) > 0.001 ||
          Math.abs(tlx - s.rx) > 0.02 ||
          Math.abs(tly - s.ry) > 0.02;
        if (!moving) {
          if (!s.dirty) return;
          s.y = ty;
          s.z = tz;
          s.s = ts;
          s.rx = tlx;
          s.ry = tly;
          s.dirty = false;
        } else {
          s.dirty = true;
        }
        el.style.transform = `translate3d(0, ${s.y.toFixed(2)}px, ${s.z.toFixed(2)}px) rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg) scale(${s.s.toFixed(4)})`;
      });

      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        if (!running) {
          running = true;
          prev = 0;
          raf = requestAnimationFrame(tick);
        }
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(host);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouse.current = null;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [word]);

  useEffect(() => {
    letters.current = letters.current.slice(0, word.length);
  }, [word]);

  return (
    <Link
      ref={link}
      href={href}
      className="group relative block w-full py-4 text-slate-900 [--fg:15,23,42] dark:text-slate-100 dark:[--fg:255,255,255]"
    >
      <style>{`
        @keyframes hi-sharp {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes hi-ghost {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .hi-sharp { animation: hi-sharp 900ms cubic-bezier(0.22, 1, 0.36, 1) backwards; }
        .hi-ghost { animation: hi-ghost 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .hi-sharp { animation: none; }
          .hi-ghost { display: none; }
        }
      `}</style>

      <span className="sr-only">Say hi</span>

      <span
        aria-hidden="true"
        className="font-label block text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 sm:text-xs"
      >
        Got a minute?
      </span>

      <span
        ref={stage}
        aria-hidden="true"
        className="relative mt-4 flex items-end justify-between gap-4"
        style={{ perspective: "1000px" }}
      >
        <span
          key={word}
          ref={wordEl}
          className="relative flex min-h-[1.15em] text-[16vw] font-bold leading-none tracking-tighter will-change-transform [transform-style:preserve-3d] sm:text-[10vw]"
        >
          {Array.from(word).map((ch, k) => {
            const glyph = ch === " " ? " " : ch;
            const delay = `${k * 45}ms`;
            return (
              <span
                key={k}
                className="letter-rise inline-block [transform-style:preserve-3d]"
                style={{ animationDelay: delay }}
              >
                <span
                  ref={(el) => {
                    letters.current[k] = el;
                  }}
                  className="relative inline-block origin-bottom will-change-transform [transform-style:preserve-3d]"
                >
                  {LAYERS.map((l, n) => (
                    <span
                      key={n}
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 block text-slate-900 dark:text-white ${l.cls}`}
                      style={{
                        transform: `translateZ(${-l.z}px)`,
                        ...(l.blur
                          ? {
                              textShadow: `0 0 ${l.blur * 2}px currentColor`,
                              WebkitTextFillColor: "transparent",
                            }
                          : null),
                      }}
                    >
                      {glyph}
                    </span>
                  ))}

                  <span
                    aria-hidden="true"
                    className="hi-ghost pointer-events-none absolute inset-0 block"
                    style={{ ...GHOST, animationDelay: delay }}
                  >
                    {glyph}
                  </span>

                  <span
                    className="hi-sharp block"
                    style={{
                      animationDelay: delay,
                      transform: "translateZ(1px)",
                    }}
                  >
                    {glyph}
                  </span>

                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 block text-transparent"
                    style={{
                      transform: "translateZ(3px)",
                      WebkitTextStroke: "1px rgba(var(--fg),0.28)",
                    }}
                  >
                    {glyph}
                  </span>
                </span>
              </span>
            );
          })}
        </span>

        <svg
          viewBox="0 0 24 24"
          className="mb-2 h-10 w-10 shrink-0 -rotate-45 text-slate-500 transition-all duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:translate-x-2 group-hover:rotate-0 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100 sm:mb-4 sm:h-16 sm:w-16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
