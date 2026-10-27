"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";

type Phase = "hidden" | "loading" | "ready" | "opening";

const TOTAL = 12;
const STEPS = [120, 90, 160, 100, 200, 110, 90, 170, 100, 130, 140, 180];
const PATH_A = "M325 193 H264 A82 82 0 0 0 264 357 H325";
const PATH_B = "M258 275 H321 A82 82 0 0 1 321 439 H258";

function shouldSkip() {
  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    return (
      nav?.type === "reload" ||
      sessionStorage.getItem("intro-seen") === "1" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

function isLite() {
  try {
    return window.matchMedia("(pointer: coarse), (max-width: 639px)").matches;
  } catch {
    return false;
  }
}

/**
 * Fondo para móvil: un div normal (sin máscara SVG animada, que es lo que
 * causaba el lag). Usa overscan para cubrir SIEMPRE toda la pantalla aunque
 * la barra del navegador móvil aparezca/desaparezca.
 */
function LiteBackdrop({ opening }: { opening: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="fixed -inset-x-2 -bottom-40 -top-40 z-50 bg-white dark:bg-slate-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={
        opening
          ? { duration: 0.7, delay: 0.25, ease: "easeInOut" }
          : { duration: 0 }
      }
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(128,128,128,0.35) 1px, transparent 1.6px)",
          backgroundSize: "22px 22px",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 72%)",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 72%)",
        }}
      />
    </motion.div>
  );
}

function Cover({
  drawn,
  phase,
  lite,
}: {
  drawn: boolean;
  phase: Phase;
  lite: boolean;
}) {
  const opening = phase === "opening";

  // framer-motion mueve el valor sin re-renders de React (GPU transform).
  const k = useMotionValue(1);
  const transform = useMotionTemplate`translate(-2.5px,-40px) scale(calc(var(--s) * ${k})) translate(2.5px,40px)`;

  useEffect(() => {
    if (phase === "ready") {
      const c = animate(k, 0.9, {
        type: "spring",
        stiffness: 320,
        damping: 18,
      });
      return () => c.stop();
    }
    if (phase === "opening") {
      const c = lite
        ? animate(k, 1.15, { duration: 0.6, ease: "easeOut" })
        : animate(k, 140, { duration: 1.4, ease: [0.76, 0, 0.24, 1] });
      return () => c.stop();
    }
  }, [phase, lite, k]);

  const draw = (delay: number) => ({
    strokeDashoffset: drawn ? 0 : 1,
    opacity: drawn ? 1 : 0,
    transition: `stroke-dashoffset 1100ms cubic-bezier(0.65,0,0.35,1) ${delay}ms, opacity 150ms ${delay}ms`,
  });

  return (
    <>
      {lite && <LiteBackdrop opening={opening} />}

      <svg
        className="fixed inset-0 z-50 h-full w-full text-slate-900 [--s:0.34] sm:[--s:0.44] dark:text-slate-100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {!lite && (
          <defs>
            <radialGradient id="intro-fade" r="0.75">
              <stop offset="0.3" stopColor="white" />
              <stop offset="0.72" stopColor="black" />
            </radialGradient>

            <mask id="intro-fade-mask">
              <rect width="100%" height="100%" fill="url(#intro-fade)" />
            </mask>

            <pattern
              id="intro-dots"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="11"
                cy="11"
                r="1"
                fill="rgb(128,128,128)"
                fillOpacity="0.35"
              />
            </pattern>

            <mask
              id="intro-hole"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="100%"
              height="100%"
            >
              <rect width="100%" height="100%" fill="white" />
              <svg x="50%" y="50%" overflow="visible">
                <motion.g style={{ transform, opacity: opening ? 1 : 0 }}>
                  <g
                    transform="translate(-292.5 -315)"
                    fill="none"
                    stroke="black"
                    strokeWidth={54}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={PATH_A} />
                    <path d={PATH_B} />
                  </g>
                </motion.g>
              </svg>
            </mask>
          </defs>
        )}

        {!lite && (
          <g mask="url(#intro-hole)">
            <rect
              width="100%"
              height="100%"
              className="fill-white dark:fill-slate-950"
            />
            <rect
              width="100%"
              height="100%"
              fill="url(#intro-dots)"
              mask="url(#intro-fade-mask)"
            />
          </g>
        )}

        <svg x="50%" y="50%" overflow="visible">
          <motion.g style={{ transform }}>
            <g
              transform="translate(-292.5 -315)"
              fill="none"
              stroke="currentColor"
              strokeWidth={54}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                opacity: opening ? 0 : 1,
                transition: opening ? "opacity 500ms ease-in 200ms" : "none",
              }}
            >
              <path
                d={PATH_A}
                pathLength={1}
                strokeDasharray="1 1"
                style={draw(0)}
              />
              <path
                d={PATH_B}
                pathLength={1}
                strokeDasharray="1 1"
                style={draw(350)}
              />
            </g>
          </motion.g>
        </svg>
      </svg>
    </>
  );
}

function Progress({
  drawn,
  filled,
  phase,
}: {
  drawn: boolean;
  filled: number;
  phase: Phase;
}) {
  const percent = Math.round((filled / TOTAL) * 100);
  const visible = drawn && phase === "loading";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-1/2 z-[51] mt-24 flex justify-center px-5 sm:mt-28">
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="h-px w-40 bg-slate-200 sm:w-52 dark:bg-slate-800">
          <motion.div
            className="h-full origin-left bg-slate-900 dark:bg-slate-100"
            initial={false}
            animate={{ scaleX: filled / TOTAL }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>

        <span className="font-mono text-[10px] tabular-nums tracking-widest text-slate-500 sm:text-xs dark:text-slate-400">
          {String(percent).padStart(3, "0")}
        </span>
      </motion.div>
    </div>
  );
}

export default function Intro() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [drawn, setDrawn] = useState(false);
  const [filled, setFilled] = useState(0);
  // Por defecto versión ligera (móvil); en desktop se cambia en el effect.
  const [lite, setLite] = useState(true);
  const skip = useRef<boolean | null>(null);

  useEffect(() => {
    if (skip.current === null) skip.current = shouldSkip();

    if (skip.current) {
      setPhase("hidden");
      return;
    }

    setLite(isLite());

    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {}

    document.body.style.overflow = "hidden";

    const timers: ReturnType<typeof setTimeout>[] = [];
    const after = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    after(() => setDrawn(true), 50);

    let elapsed = 700;
    STEPS.forEach((step, i) => {
      elapsed += step;
      after(() => setFilled(i + 1), elapsed);
    });

    after(() => setPhase("ready"), elapsed + 250);
    after(() => setPhase("opening"), elapsed + 700);
    after(() => {
      setPhase("hidden");
      document.body.style.overflow = "";
    }, elapsed + 2200);

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div id="intro-root" aria-hidden="true" suppressHydrationWarning>
      <Cover drawn={drawn} phase={phase} lite={lite} />
      <Progress drawn={drawn} filled={filled} phase={phase} />
    </div>
  );
}
