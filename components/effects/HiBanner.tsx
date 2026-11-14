"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const greetings = [
  "Say hi",
  "Hola",
  "Bonjour",
  "Ciao",
  "こんにちは",
  "Hallo",
  "Olá",
];

export default function HiBanner({ href }: { href: string }) {
  const [i, setI] = useState(0);
  const link = useRef<HTMLAnchorElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const word = greetings[i];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % greetings.length), 2400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const host = link.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let mouse: { x: number; y: number } | null = null;
    const cur: { y: number; s: number }[] = [];

    const tick = () => {
      let moving = false;
      letters.current.forEach((el, k) => {
        const box = el?.parentElement;
        if (!el || !box) return;
        const c = cur[k] ?? (cur[k] = { y: 0, s: 1 });
        let ty = 0;
        let ts = 1;
        if (mouse) {
          const r = box.getBoundingClientRect();
          const d = Math.hypot(
            mouse.x - (r.left + r.width / 2),
            mouse.y - (r.top + r.height / 2),
          );
          const f = Math.max(0, 1 - d / (r.height * 1.8));
          ty = -f * r.height * 0.2;
          ts = 1 + f * 0.4;
        }
        c.y += (ty - c.y) * 0.12;
        c.s += (ts - c.s) * 0.12;
        el.style.transform = `translate3d(0, ${c.y}px, 0) scale(${c.s})`;
        if (Math.abs(ty - c.y) > 0.05 || Math.abs(ts - c.s) > 0.001) {
          moving = true;
        }
      });
      if (moving || mouse) {
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

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouse = { x: e.clientX, y: e.clientY };
      start();
    };

    const onLeave = () => {
      mouse = null;
      start();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [word]);

  letters.current = [];

  return (
    <Link
      ref={link}
      href={href}
      className="group relative block w-full py-4 text-slate-800 dark:text-slate-100"
    >
      <span className="sr-only">Say hi</span>

      <span
        aria-hidden="true"
        className="font-label block text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400"
      >
        Got a minute?
      </span>

      <span
        aria-hidden="true"
        className="mt-4 flex items-end justify-between gap-4"
      >
        <span
          key={word}
          className="flex min-h-[1.15em] text-[16vw] font-bold leading-none tracking-tighter sm:text-[10vw]"
        >
          {Array.from(word).map((ch, k) => (
            <span
              key={k}
              className="letter-rise inline-block"
              style={{ animationDelay: `${k * 45}ms` }}
            >
              <span
                ref={(el) => {
                  letters.current[k] = el;
                }}
                className="inline-block origin-bottom will-change-transform"
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            </span>
          ))}
        </span>

        <svg
          viewBox="0 0 24 24"
          className="mb-2 h-10 w-10 shrink-0 -rotate-45 text-slate-500 transition-all duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:translate-x-2 group-hover:rotate-0 group-hover:text-slate-900 sm:mb-4 sm:h-16 sm:w-16 dark:text-slate-400 dark:group-hover:text-white"
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
