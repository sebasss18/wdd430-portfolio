// Carrusel de proyectos destacados que permite cambiar de tarjeta con arrastre.
"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type Project = { id: string | number; title: string; type: string };

const SWIPE_THRESHOLD = 50;
const DRAG_START = 8;

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);
  const total = projects.length;

  if (total === 0) return null;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const resetDrag = () => {
    startX.current = null;
    setDragging(false);
    setDragX(0);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
    moved.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (!moved.current && Math.abs(dx) > DRAG_START) {
      moved.current = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (moved.current) setDragX(dx);
  };

  const onPointerUp = () => {
    if (startX.current === null) return;
    if (moved.current) {
      if (dragX < -SWIPE_THRESHOLD) next();
      else if (dragX > SWIPE_THRESHOLD) prev();
    }
    resetDrag();
  };

  const arrow =
    "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all duration-300 hover:scale-110 hover:bg-slate-100 active:scale-90 sm:h-9 sm:w-9 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800";

  const isPaused = paused || dragging;

  return (
    <section
      aria-label="Featured projects"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={resetDrag}
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
            moved.current = false;
          }
        }}
        className="mx-auto max-w-3xl cursor-grab touch-pan-y select-none overflow-hidden [--basis:86%] [--off:7%] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] active:cursor-grabbing sm:[--basis:72%] sm:[--off:14%] sm:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div
          className={`flex w-full ${
            dragging
              ? "transition-none"
              : "transition-transform duration-[900ms] ease-[cubic-bezier(0.25,1.12,0.35,1)] sm:duration-[1400ms]"
          }`}
          style={{
            transform: `translateX(calc(var(--off) - ${index} * var(--basis) + ${dragX}px))`,
          }}
        >
          {projects.map((project, i) => {
            const active = i === index;
            return (
              <div
                key={project.id}
                className="shrink-0 basis-[var(--basis)] px-1.5 py-4 sm:px-2"
              >
                <Link
                  href="/projects"
                  draggable={false}
                  tabIndex={active ? undefined : -1}
                  onClick={(e) => {
                    if (!active) {
                      e.preventDefault();
                      setIndex(i);
                    }
                  }}
                  className={`group relative isolate flex h-52 flex-col justify-between overflow-hidden rounded-3xl border p-6 transition-[scale,translate,opacity,background-color,border-color] duration-[900ms] ease-[cubic-bezier(0.25,1.12,0.35,1)] sm:h-56 sm:p-8 sm:duration-[1100ms] ${
                    active
                      ? "scale-100 border-slate-400 bg-white opacity-100 hover:-translate-y-1.5 hover:border-slate-800 dark:border-slate-500 dark:bg-slate-900 dark:hover:border-slate-200"
                      : "scale-90 border-slate-200 bg-slate-50 opacity-40 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-slate-800 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 motion-reduce:transition-none dark:bg-white"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm tabular-nums text-slate-400 transition-colors duration-500 dark:text-slate-500 ${
                        active
                          ? "group-hover:text-slate-300 dark:group-hover:text-slate-500"
                          : ""
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(total).padStart(2, "0")}
                    </span>
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-all duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] dark:border-slate-600 dark:text-slate-200 ${
                        active
                          ? "group-hover:-rotate-45 group-hover:scale-110 group-hover:border-white group-hover:bg-white group-hover:text-slate-800 dark:group-hover:border-slate-900 dark:group-hover:bg-slate-900 dark:group-hover:text-white"
                          : ""
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`truncate text-2xl font-semibold tracking-tight transition-colors duration-500 sm:text-3xl ${
                        active
                          ? "group-hover:text-white dark:group-hover:text-slate-900"
                          : ""
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm text-slate-500 transition-colors duration-500 dark:text-slate-400 ${
                        active
                          ? "group-hover:text-slate-300 dark:group-hover:text-slate-600"
                          : ""
                      }`}
                    >
                      {project.type}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 sm:mt-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous project"
          className={arrow}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {projects.map((project, i) => {
            const active = i === index;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to ${project.title}`}
                aria-current={active ? "true" : undefined}
                className={`h-1.5 overflow-hidden rounded-full bg-slate-200 transition-all duration-500 dark:bg-slate-700 ${
                  active ? "w-12" : "w-4"
                }`}
              >
                {active && (
                  <span
                    key={index}
                    onAnimationEnd={next}
                    style={{
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                    className="block h-full w-full origin-left animate-fill rounded-full bg-slate-800 dark:bg-slate-200"
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next project"
          className={arrow}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
