"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  speed?: number;
  fade?: boolean;
  className?: string;
};

export default function Parallax({
  children,
  speed = 0.3,
  fade = false,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let cur = Math.max(0, window.scrollY);
    let prev = cur;
    let lastMove = 0;
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let lastOpacity = -1;

    const apply = () => {
      el.style.transform = `translate3d(0, ${(cur * speed).toFixed(2)}px, 0)`;
      if (fade) {
        const o = Number(Math.max(0, 1 - cur / (vh * 0.8)).toFixed(2));
        if (o !== lastOpacity) {
          lastOpacity = o;
          el.style.opacity = String(o);
        }
      }
    };

    const tick = (now: number) => {
      const t = Math.max(0, window.scrollY);
      if (t !== prev) {
        prev = t;
        lastMove = now;
      }
      cur += (t - cur) * 0.25;
      if (Math.abs(t - cur) < 0.05) cur = t;
      apply();
      if (cur !== t || now - lastMove < 200) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      lastMove = performance.now();
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (window.innerWidth !== vw) {
        vw = window.innerWidth;
        vh = window.innerHeight;
      }
      start();
    };

    apply();
    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("touchmove", start, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("touchmove", start);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [speed, fade]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
