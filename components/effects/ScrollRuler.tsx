"use client";

import { useEffect, useRef } from "react";

type Props = {
  items: string[];
};

const MINOR = 12;
const MAJOR = 60;
const edge =
  "linear-gradient(to right, transparent, black 18%, black 82%, transparent)";
const tick = "linear-gradient(to right, currentColor 1px, transparent 1px)";

export default function ScrollRuler({ items }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const unit = useRef<HTMLDivElement>(null);
  const minor = useRef<HTMLDivElement>(null);
  const major = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const tags = useRef<(HTMLSpanElement | null)[]>([]);

  const row = [...items, ...items];

  useEffect(() => {
    const root = host.current;
    const tr = track.current;
    const u = unit.current;
    if (!root || !tr || !u) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let running = false;
    let cur = Math.max(0, window.scrollY);
    let hostW = 0;
    let unitW = 0;
    let offsets: number[] = [];

    const measure = () => {
      hostW = root.clientWidth;
      unitW = u.offsetWidth;
      offsets = tags.current.map((el) =>
        el ? el.offsetLeft + el.offsetWidth / 2 : 0,
      );
    };

    const render = () => {
      const x = cur * 0.6;
      const shift = unitW > 0 ? -(x % unitW) : 0;
      tr.style.transform = `translate3d(${shift}px, 0, 0)`;
      if (minor.current) minor.current.style.backgroundPositionX = `${-x}px`;
      if (major.current) major.current.style.backgroundPositionX = `${-x}px`;
      if (readout.current) {
        readout.current.textContent = `X ${String(Math.round(x)).padStart(5, "0")}`;
      }
      const mid = hostW / 2;
      const range = hostW * 0.28;
      for (let i = 0; i < tags.current.length; i++) {
        const el = tags.current[i];
        if (!el) continue;
        const d = Math.abs(offsets[i] + shift - mid);
        const f = range > 0 ? Math.max(0, 1 - d / range) : 0;
        el.style.opacity = String(0.25 + f * 0.75);
        el.style.transform = `translate3d(0, ${-f * 6}px, 0)`;
      }
    };

    const tick = () => {
      const t = Math.max(0, window.scrollY);
      cur = reduce ? t : cur + (t - cur) * 0.08;
      render();
      if (Math.abs(t - cur) > 0.1) {
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

    let lastW = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        measure();
      }
      start();
    };

    measure();
    render();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measure();
        render();
      });
    }
    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="relative select-none py-14 text-slate-400 sm:py-24 dark:text-slate-600"
    >
      <div
        className="relative h-24 overflow-hidden sm:h-32"
        style={{ maskImage: edge, WebkitMaskImage: edge }}
      >
        <div
          ref={track}
          className="absolute left-0 top-0 flex h-14 w-max items-center will-change-transform sm:h-20"
        >
          {[0, 1].map((k) => (
            <div
              key={k}
              ref={k === 0 ? unit : undefined}
              className="flex shrink-0 items-center"
            >
              {row.map((t, j) => (
                <span key={j} className="flex items-center">
                  <span
                    ref={(el) => {
                      tags.current[k * row.length + j] = el;
                    }}
                    className="font-label flex items-center gap-3 whitespace-nowrap px-6 text-xs uppercase tracking-[0.35em] text-slate-900 sm:gap-4 sm:px-12 sm:text-base dark:text-white"
                    style={{ opacity: 0.25 }}
                  >
                    <span className="text-[10px] opacity-60">
                      {`0${(j % items.length) + 1}`}
                    </span>
                    {t}
                  </span>
                  <span className="text-xs">+</span>
                </span>
              ))}
            </div>
          ))}
        </div>

        <div
          ref={minor}
          className="absolute inset-x-0 bottom-0 h-2 opacity-60"
          style={{ backgroundImage: tick, backgroundSize: `${MINOR}px 100%` }}
        />
        <div
          ref={major}
          className="absolute inset-x-0 bottom-0 h-5 sm:h-6"
          style={{ backgroundImage: tick, backgroundSize: `${MAJOR}px 100%` }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-current opacity-60" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-slate-900 dark:to-white" />
      </div>

      <span
        ref={readout}
        className="font-label mt-4 block text-center text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400"
      >
        X 00000
      </span>
    </div>
  );
}
