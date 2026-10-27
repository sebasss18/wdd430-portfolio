"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Project = {
  id: string | number;
  title: string;
  type: string;
  preview?: string;
  url?: string;
  tags?: string[];
};

const SWIPE_THRESHOLD = 50;
const DRAG_START = 8;
// Ancho del "monitor" virtual en el que se renderiza el sitio antes de reducirlo.
const VIEWPORT_W = 1024;
// Espera a que termine el desplazamiento antes de montar el iframe.
const SETTLE_MS = 450;

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
};

function Skeleton({ seed }: { seed: number }) {
  const w = [62, 78, 54, 86][seed % 4];
  return (
    <div className="flex h-72 flex-col gap-2.5 p-3">
      <div className="shimmer h-16 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800" />
      <div
        className="h-2 rounded bg-slate-200 dark:bg-slate-700"
        style={{ width: `${w}%` }}
      />
      <div className="h-2 w-full rounded bg-slate-100 dark:bg-slate-800" />
      <div className="h-2 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="shimmer h-14 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="shimmer h-14 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="shimmer h-14 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
      <div className="h-2 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-2 w-full rounded bg-slate-100 dark:bg-slate-800" />
      <div className="h-2 w-4/5 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="shimmer h-16 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800" />
    </div>
  );
}

// Renderiza el sitio a 1024px de ancho y lo escala para que quepa exacto en la
// ventana. Mide el contenedor con clientWidth/clientHeight (no les afectan las
// transformaciones de las tarjetas), así el iframe nunca se sale del marco.
function LivePreview({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ scale: number; h: number } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const scale = w / VIEWPORT_W;
      setSize({ scale, h: h / scale });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden [contain:strict]">
      {size && (
        <iframe
          src={src}
          title={title}
          tabIndex={-1}
          aria-hidden="true"
          scrolling="no"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          style={{
            width: VIEWPORT_W,
            height: size.h,
            transform: `scale(${size.scale})`,
          }}
          className={`pointer-events-none absolute left-0 top-0 max-w-none origin-top-left border-0 bg-white transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const startX = useRef<number | null>(null);
  const moved = useRef(false);
  const pendingX = useRef(0);
  const dragRaf = useRef(0);
  const mounted = useRef(false);
  const dots = useRef<Dot[]>([]);
  const fx = useRef<{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    w: number;
    h: number;
    color: string;
    at: number;
  } | null>(null);
  const loopId = useRef(0);
  const lastT = useRef(0);
  const total = projects.length;
  const hasItems = total > 0;
  const awake = inView && tabVisible;

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if ("vibrate" in navigator) navigator.vibrate(8);
  }, [index]);

  // Solo UNA tarjeta tiene el sitio cargado, y solo cuando el carrusel se detuvo.
  useEffect(() => {
    const t = setTimeout(() => setLive(index), SETTLE_MS);
    return () => clearTimeout(t);
  }, [index]);

  // Si el carrusel sale de pantalla o la pestaña se oculta, se pausa todo.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hasItems]);

  useEffect(
    () => () => {
      cancelAnimationFrame(dragRaf.current);
      cancelAnimationFrame(loopId.current);
    },
    [],
  );

  if (total === 0) return null;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const resetDrag = () => {
    cancelAnimationFrame(dragRaf.current);
    dragRaf.current = 0;
    pendingX.current = 0;
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
    if (moved.current) {
      // Un solo render por frame, no uno por cada evento del puntero.
      pendingX.current = dx;
      if (!dragRaf.current) {
        dragRaf.current = requestAnimationFrame(() => {
          dragRaf.current = 0;
          setDragX(pendingX.current);
        });
      }
    }
  };

  const onPointerUp = () => {
    if (startX.current === null) return;
    if (moved.current) {
      if (pendingX.current < -SWIPE_THRESHOLD) next();
      else if (pendingX.current > SWIPE_THRESHOLD) prev();
    }
    resetDrag();
  };

  const loop = (now: number) => {
    const f = fx.current;
    if (!f || !f.canvas.isConnected) {
      dots.current = [];
      loopId.current = 0;
      return;
    }
    const dt = Math.min((now - lastT.current) / 1000, 0.05);
    lastT.current = now;
    f.ctx.clearRect(0, 0, f.w, f.h);
    f.ctx.fillStyle = f.color;
    const list = dots.current;
    for (let i = list.length - 1; i >= 0; i--) {
      const d = list[i];
      d.life += dt;
      if (d.life >= d.max) {
        list.splice(i, 1);
        continue;
      }
      const k = d.life / d.max;
      const damp = 1 - dt * 1.6;
      d.vx *= damp;
      d.vy = d.vy * damp - dt * 10;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      f.ctx.globalAlpha = (1 - k) * (1 - k) * 0.8;
      f.ctx.fillRect(d.x, d.y, d.size, d.size);
    }
    f.ctx.globalAlpha = 1;
    loopId.current = list.length ? requestAnimationFrame(loop) : 0;
  };

  // Solo partículas. Se quitó la inclinación 3D porque forzaba a recomponer
  // el iframe en cada movimiento del mouse.
  const onFx = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || dragging) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const canvas = el.querySelector<HTMLCanvasElement>("[data-fx]");
    if (!canvas) return;
    let f = fx.current;
    if (!f || f.canvas !== canvas) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      f = fx.current = { canvas, ctx, w: 0, h: 0, color: "#ffffff", at: 0 };
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (
      canvas.width !== Math.round(w * dpr) ||
      canvas.height !== Math.round(h * dpr)
    ) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      f.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    f.w = w;
    f.h = h;

    const now = performance.now();
    if (now - f.at > 150) {
      const title = el.querySelector("h3");
      if (title) f.color = getComputedStyle(title).color;
      f.at = now;
    }

    const count = Math.random() < 0.5 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      if (dots.current.length >= 60) break;
      const a = Math.random() * Math.PI * 2;
      const s = 14 + Math.random() * 36;
      dots.current.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 0,
        max: 0.6 + Math.random() * 0.6,
        size: Math.random() < 0.7 ? 1.5 : 2.5,
      });
    }

    if (!loopId.current) {
      lastT.current = now;
      loopId.current = requestAnimationFrame(loop);
    }
  };

  const arrow =
    "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-all duration-300 hover:scale-110 hover:bg-slate-100 active:scale-90 sm:h-9 sm:w-9 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800";

  const isPaused = paused || dragging || !awake;

  return (
    <section
      ref={sectionRef}
      aria-label="Featured projects"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
      }}
    >
      <div className="relative mx-auto max-w-3xl">
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
        className="cursor-grab touch-pan-y select-none overflow-hidden [--basis:86%] [--off:7%] active:cursor-grabbing sm:[--basis:80%] sm:[--off:10%]"
      >
        <div
          className={`flex w-full ${
            dragging
              ? "transition-none"
              : "transition-transform duration-[700ms] ease-[cubic-bezier(0.25,1.12,0.35,1)] sm:duration-[900ms]"
          }`}
          style={{
            transform: `translateX(calc(var(--off) - ${index} * var(--basis) + ${dragX}px))`,
          }}
        >
          {projects.map((project, i) => {
            const active = i === index;
            const showLive = Boolean(project.preview) && awake && live === i;
            const host =
              project.url?.replace(/^https?:\/\//, "").replace(/\/$/, "") ??
              "localhost:3000";
            return (
              <div
                key={project.id}
                className="min-w-0 shrink-0 basis-[var(--basis)] px-1.5 py-4 sm:px-2"
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
                  onPointerMove={active ? onFx : undefined}
                  className={`group relative isolate flex h-[26rem] w-full min-w-0 flex-col gap-4 overflow-hidden rounded-3xl border p-5 transition-[scale,translate,opacity,background-color,border-color] duration-[700ms] ease-[cubic-bezier(0.25,1.12,0.35,1)] sm:h-72 sm:flex-row sm:gap-6 sm:p-7 sm:duration-[800ms] ${
                    active
                      ? "scale-100 border-slate-400 bg-white opacity-100 hover:-translate-y-1.5 hover:border-slate-800 dark:border-slate-500 dark:bg-slate-900 dark:hover:border-slate-200"
                      : "scale-90 border-slate-200 bg-slate-50 opacity-40 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  {active && (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-slate-800 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 motion-reduce:transition-none dark:bg-white"
                      />
                      <canvas
                        data-fx
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                      />
                    </>
                  )}

                  <div
                    className={`win relative h-48 w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 sm:order-last sm:h-full sm:w-[52%] dark:border-slate-700 dark:bg-slate-950 ${
                      active ? "pop" : ""
                    }`}
                  >
                    <div className="flex h-6 items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-2.5 dark:border-slate-700 dark:bg-slate-900">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="ml-2 min-w-0 flex-1 truncate rounded bg-white px-2 text-[10px] leading-4 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                        {host}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 top-6 overflow-hidden bg-white dark:bg-slate-950">
                      <div className="absolute inset-x-0 top-0">
                        <Skeleton seed={i} />
                      </div>
                      {showLive && project.preview && (
                        <LivePreview
                          src={project.preview}
                          title={`Preview of ${project.title}`}
                        />
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex min-w-0 flex-1 flex-col justify-between ${
                      active ? "rise" : ""
                    }`}
                  >
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

                    <div className="min-w-0">
                      <h3
                        className={`line-clamp-2 break-words text-2xl font-semibold leading-tight tracking-tight transition-colors duration-500 sm:text-3xl ${
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
                      {project.tags && project.tags.length > 0 && (
                        <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className={`rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-500 transition-colors duration-500 dark:border-slate-700 dark:text-slate-400 ${
                                active
                                  ? "group-hover:border-slate-600 group-hover:text-slate-300 dark:group-hover:border-slate-300 dark:group-hover:text-slate-600"
                                  : ""
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[6%] bg-gradient-to-r from-white to-transparent sm:w-[8%] dark:from-slate-950"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[6%] bg-gradient-to-l from-white to-transparent sm:w-[8%] dark:from-slate-950"
      />
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
