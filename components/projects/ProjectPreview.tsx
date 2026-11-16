"use client";

import { useEffect, useRef, useState } from "react";

const VIEWPORT_W = 1280;

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

export default function ProjectPreview({
  src,
  image,
  title,
  host,
}: {
  src?: string | null;
  image?: string | null;
  title: string;
  host: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex h-8 items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-900">
        <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span className="ml-3 min-w-0 flex-1 truncate rounded bg-white px-3 text-[11px] leading-5 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          {host}
        </span>
      </div>
      <div className="relative aspect-[16/10] w-full bg-white dark:bg-slate-950">
        <div className="absolute inset-0 flex flex-col gap-3 p-5">
          <div className="shimmer h-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="shimmer h-20 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="shimmer h-20 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="shimmer h-20 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
        {src ? (
          <LivePreview src={src} title={`Preview of ${title}`} />
        ) : image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={`Screenshot of ${title}`}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : null}
      </div>
    </div>
  );
}
