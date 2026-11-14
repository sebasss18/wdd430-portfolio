"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import DotField from "@/components/effects/DotField";

type Item = {
  title: string;
  text: string;
  icon: ReactNode;
};

const RX = 96;
const RY = 40;
const glyphs = "01<>/{}[]#%+=*";

const orbit = `M ${-RX} 0 A ${RX} ${RY} 0 1 1 ${RX} 0 A ${RX} ${RY} 0 1 1 ${-RX} 0`;

const place = (i: number, a: number, n: number) => {
  const th = Math.PI + (i - a) * ((2 * Math.PI) / n);
  const front = (Math.sin(th) + 1) / 2;
  const f = Math.max(0, 1 - Math.abs(a - i) * 1.6);
  return {
    x: Number((Math.cos(th) * RX).toFixed(2)),
    y: Number((Math.sin(th) * RY).toFixed(2)),
    s: Number((0.7 + front * 0.25 + f * 0.25).toFixed(3)),
    o: Number(Math.min(1, 0.2 + front * 0.3 + f * 0.5).toFixed(3)),
    f: Number(f.toFixed(3)),
  };
};

function useScramble(text: string) {
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const reveal = Math.floor(frame / 2);
      setOut(
        Array.from(text)
          .map((c, i) =>
            i < reveal || c === " "
              ? c
              : glyphs[Math.floor(Math.random() * glyphs.length)],
          )
          .join(""),
      );
      if (reveal >= text.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [text]);

  return out;
}

export default function OrbitScroll({
  items,
  label,
}: {
  items: Item[];
  label: string;
}) {
  const n = items.length;
  const section = useRef<HTMLElement>(null);
  const nodes = useRef<(SVGGElement | null)[]>([]);
  const reticles = useRef<(SVGGElement | null)[]>([]);
  const arc = useRef<SVGPathElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const title = useScramble(items[active].title);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let running = false;
    let cur = -1;
    let last = 0;

    const target = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      return Math.min(1, Math.max(0, -rect.top / total));
    };

    const render = (p: number) => {
      const a = p * (n - 1);
      for (let i = 0; i < n; i++) {
        const q = place(i, a, n);
        const nd = nodes.current[i];
        const rt = reticles.current[i];
        if (nd) {
          nd.setAttribute(
            "transform",
            `translate(${q.x} ${q.y}) scale(${q.s})`,
          );
          nd.style.opacity = String(q.o);
        }
        if (rt) rt.style.opacity = String(q.f);
      }
      if (arc.current) {
        arc.current.style.strokeDasharray = `${p.toFixed(4)} 2`;
      }
      if (readout.current) {
        readout.current.textContent = `SCAN ${String(Math.round(p * 100)).padStart(3, "0")}%`;
      }
      const idx = Math.round(a);
      if (idx !== last) {
        last = idx;
        setActive(idx);
      }
    };

    const tick = () => {
      const t = target();
      cur = cur < 0 || reduce ? t : cur + (t - cur) * 0.08;
      render(cur);
      if (Math.abs(t - cur) > 0.0005) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    start();
    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", start);
    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", start);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  return (
    <section
      ref={section}
      className="relative"
      style={{ height: `${n * 110}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <DotField />

        <p className="font-label absolute left-5 top-8 z-10 text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:left-16 sm:top-12 sm:text-xs dark:text-slate-400">
          {label}
        </p>

        <div className="pointer-events-none absolute inset-x-2 top-[14vh] text-slate-400 sm:inset-x-auto sm:right-[3vw] sm:top-1/2 sm:w-[58vw] sm:-translate-y-1/2 dark:text-slate-600">
          <svg
            viewBox="-110 -58 220 116"
            className="w-full overflow-visible"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <ellipse
              rx={RX + 9}
              ry={RY + 7}
              strokeWidth="0.3"
              strokeDasharray="0.6 3"
            />
            <ellipse
              rx={RX * 0.62}
              ry={RY * 0.62}
              strokeWidth="0.25"
              strokeDasharray="1 3"
            />
            <path d={orbit} strokeWidth="0.4" />
            <path
              ref={arc}
              d={orbit}
              pathLength={1}
              strokeWidth="0.9"
              strokeLinecap="round"
              style={{ strokeDasharray: "0 2" }}
              className="text-slate-900 dark:text-white"
            />
            <path d="M-3 0H3M0 -3V3" strokeWidth="0.4" />

            {items.map((it, i) => {
              const q = place(i, 0, n);
              return (
                <g
                  key={it.title}
                  ref={(el) => {
                    nodes.current[i] = el;
                  }}
                  transform={`translate(${q.x} ${q.y}) scale(${q.s})`}
                  style={{ opacity: q.o }}
                >
                  <g
                    ref={(el) => {
                      reticles.current[i] = el;
                    }}
                    style={{ opacity: q.f }}
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    className="text-slate-900 dark:text-white"
                  >
                    <path d="M-9 -4V-9H-4M4 -9H9V-4M9 4V9H4M-4 9H-9V4" />
                  </g>
                  <g
                    transform="scale(0.42) translate(-12 -12)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-900 dark:text-white"
                  >
                    {it.icon}
                  </g>
                  <text
                    y="15"
                    textAnchor="middle"
                    fontSize="3"
                    fill="currentColor"
                    stroke="none"
                    className="font-label"
                  >
                    {`0${i + 1}`}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="absolute inset-x-5 bottom-24 z-10 sm:inset-x-auto sm:bottom-auto sm:left-16 sm:top-1/2 sm:w-[26rem] sm:-translate-y-1/2">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400">
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
          <h3
            aria-label={items[active].title}
            className="mt-3 whitespace-nowrap text-4xl font-bold tracking-tighter sm:text-6xl"
          >
            {title}
          </h3>
          <p
            key={active}
            className="pop mt-4 max-w-sm text-base text-slate-600 sm:text-lg dark:text-slate-400"
          >
            {items[active].text}
          </p>
        </div>

        <span
          ref={readout}
          className="font-label absolute bottom-8 right-5 z-10 text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:bottom-12 sm:right-12 sm:text-xs dark:text-slate-400"
        >
          SCAN 000%
        </span>
      </div>
    </section>
  );
}
