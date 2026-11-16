"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  liveUrl?: string | null;
  preview?: string;
}

const VIEWPORT_W = 1024;

const circle =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-all duration-500 dark:border-slate-600 dark:text-slate-200";

function Skeleton({ seed }: { seed: number }) {
  const w = [62, 78, 54, 86][seed % 4];
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="shimmer h-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
      <div
        className="h-2 rounded bg-slate-200 dark:bg-slate-700"
        style={{ width: `${w}%` }}
      />
      <div className="h-2 w-full rounded bg-slate-100 dark:bg-slate-800" />
      <div className="h-2 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="shimmer h-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="shimmer h-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
        <div className="shimmer h-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
}

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
    <div
      ref={box}
      className="absolute inset-0 overflow-hidden [contain:strict]"
    >
      {size && (
        <iframe
          src={src}
          title={title}
          tabIndex={-1}
          aria-hidden="true"
          scrolling="no"
          loading="lazy"
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

export default function ProjectCard({
  id,
  title,
  description,
  technologies,
  link,
  liveUrl,
  preview,
}: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const src = preview ?? liveUrl ?? undefined;
  const host =
    (liveUrl ?? link)?.replace(/^https?:\/\//, "").replace(/\/$/, "") ??
    "localhost:3000";

  useEffect(() => {
    const el = ref.current;
    if (!el || !src || armed) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, armed]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--rx", `${((0.5 - y / r.height) * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x / r.width - 0.5) * 5).toFixed(2)}deg`);
  };

  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-slate-300 bg-white p-4 transition-[translate,border-color,transform] duration-300 ease-out [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:-translate-y-1.5 hover:border-slate-800 motion-reduce:transform-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-200"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition-[translate,scale] duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:-translate-y-1 group-hover:scale-[1.03] dark:border-slate-700 dark:bg-slate-950">
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
            <Skeleton seed={id} />
          </div>
          {armed && src && (
            <LivePreview src={src} title={`Preview of ${title}`} />
          )}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-bold leading-tight tracking-tighter text-slate-900 sm:text-3xl dark:text-slate-100">
            <Link
              href={`/projects/${id}`}
              className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:underline"
            >
              {title}
            </Link>
          </h3>

          <div className="flex items-center gap-2">
            {(liveUrl ?? link) && (
              <a
                href={(liveUrl ?? link) as string}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${title} in a new tab`}
                title="Open project"
                className={`${circle} relative z-10 hover:scale-110 hover:border-slate-800 active:scale-95 dark:hover:border-white`}
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
                  <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                </svg>
              </a>
            )}

            <span
              aria-hidden="true"
              className={`${circle} group-hover:-rotate-45 group-hover:border-slate-800 dark:group-hover:border-white`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </div>

        <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-600 sm:text-base dark:text-slate-300">
          {description}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
          {technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-slate-300 px-3 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-400"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
