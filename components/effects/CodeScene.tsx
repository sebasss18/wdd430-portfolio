"use client";

// Simula la escritura progresiva de código dentro de una escena animada.
import { useEffect, useRef, useState } from "react";
import DotField from "@/components/effects/DotField";
import HiBanner from "@/components/effects/HiBanner";

const pattern = /("[^"]*"?|\bconst\b|\b\d+\b|\b[a-z]+(?=:)|[[\]{}:,=;])/g;

const TICKS = 48;

const tokenClass = (t: string) => {
  if (t.startsWith('"')) return "text-slate-900 dark:text-white";
  if (t === "const") return "italic text-slate-500 dark:text-slate-400";
  if (/^\d+$/.test(t)) return "font-bold text-slate-900 dark:text-white";
  if (/^[[\]{}:,=;]$/.test(t)) return "text-slate-400 dark:text-slate-600";
  return "text-slate-600 dark:text-slate-300";
};

function Lines({ text, cursor }: { text: string; cursor: boolean }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const active = cursor && i === lines.length - 1;
        return (
          <div
            key={i}
            className={`flex gap-4 sm:gap-8 ${
              active ? "bg-slate-900/[0.04] dark:bg-white/[0.05]" : ""
            }`}
          >
            <span
              className={`w-4 shrink-0 select-none text-right ${
                active
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-300 dark:text-slate-700"
              }`}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 whitespace-pre-wrap break-words text-slate-700 dark:text-slate-300">
              {line.split(pattern).map((p, j) =>
                j % 2 === 1 ? (
                  <span key={j} className={tokenClass(p)}>
                    {p}
                  </span>
                ) : (
                  <span key={j}>{p}</span>
                ),
              )}
              {active && (
                <span className="ml-0.5 inline-block h-[1.1em] w-[0.55ch] translate-y-[0.2em] animate-pulse bg-slate-900 dark:bg-white" />
              )}
            </span>
          </div>
        );
      })}
    </>
  );
}

export default function CodeScene({ code }: { code: string }) {
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(code.length);
      return;
    }

    setCount(0);
    let i = 0;
    let id: ReturnType<typeof setTimeout>;

    const step = () => {
      i++;
      setCount(i);
      if (i >= code.length) return;
      const ch = code[i - 1];
      const delay =
        ch === "\n" ? 240 : ",;{[".includes(ch) ? 120 : 24 + Math.random() * 30;
      id = setTimeout(step, delay);
    };

    id = setTimeout(step, 600);
    return () => clearTimeout(id);
  }, [started, run, code]);

  const done = count >= code.length;
  const typed = code.slice(0, count);
  const rows = typed.split("\n");
  const ln = rows.length;
  const col = rows[rows.length - 1].length + 1;
  const pad = (v: number) => String(v).padStart(2, "0");

  const filled = Math.floor((count / code.length) * TICKS);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden px-5 py-24 sm:px-16"
    >
      <DotField />
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="flex items-end justify-between gap-4">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400">
            The short version
          </p>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            disabled={!started}
            className="group font-label inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-slate-500 transition-all duration-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white disabled:pointer-events-none disabled:opacity-40 sm:text-xs dark:border-slate-700 dark:text-slate-400 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-3 w-3 transition-transform duration-500 ease-out group-hover:-rotate-180 group-active:-rotate-[360deg]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Replay
          </button>
        </div>

        <div className="relative mt-5 sm:mt-8">
          <div className="font-label flex items-center justify-between px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:px-8 sm:py-4 sm:text-xs dark:text-slate-400">
            <span>sebastian.ts</span>
            <span className="tabular-nums">
              {done ? "Done" : started ? "Typing" : "Idle"} · LN {pad(ln)} COL{" "}
              {pad(col)}
            </span>
          </div>
          <div className="mx-4 h-px bg-slate-300 sm:mx-8 dark:bg-slate-700" />

          <div className="relative font-mono text-[12px] leading-relaxed sm:text-base sm:leading-loose lg:text-xl lg:leading-loose">
            <pre className="sr-only">{code}</pre>
            <div
              aria-hidden="true"
              className="invisible px-4 py-4 sm:px-8 sm:py-8"
            >
              <Lines text={code} cursor={false} />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 px-4 py-4 sm:px-8 sm:py-8"
            >
              <Lines text={typed} cursor={started} />
            </div>
          </div>

          <div aria-hidden="true" className="mx-4 flex h-4 items-end sm:mx-8">
            {Array.from({ length: TICKS }).map((_, i) => {
              const on = i < filled || done;
              const head = !done && started && i === filled;
              const major = i % 8 === 0;
              return (
                <span key={i} className="flex flex-1 items-end justify-center">
                  <span
                    className={`w-px transition-all duration-300 ${
                      head
                        ? "h-4 animate-pulse bg-slate-900 dark:bg-white"
                        : on
                          ? `${major ? "h-3" : "h-2"} bg-slate-900 dark:bg-white`
                          : `${major ? "h-3" : "h-1.5"} bg-slate-300 dark:bg-slate-700`
                    }`}
                  />
                </span>
              );
            })}
          </div>
          <div className="h-4 sm:h-6" />
        </div>

        <div
          className={`mt-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-16 ${
            done
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-6 opacity-0"
          }`}
        >
          <HiBanner href="/contact" />
        </div>
      </div>
    </section>
  );
}
