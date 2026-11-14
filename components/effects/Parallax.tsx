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
    let cur = window.scrollY;

    const apply = () => {
      el.style.transform = `translate3d(0, ${cur * speed}px, 0)`;
      if (fade) {
        el.style.opacity = String(
          Math.max(0, 1 - cur / (window.innerHeight * 0.8)),
        );
      }
    };

    const tick = () => {
      const t = window.scrollY;
      cur += (t - cur) * 0.08;
      apply();
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

    apply();
    window.addEventListener("scroll", start, { passive: true });
    return () => {
      window.removeEventListener("scroll", start);
      cancelAnimationFrame(raf);
    };
  }, [speed, fade]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
