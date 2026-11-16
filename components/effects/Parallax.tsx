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
    let queued = false;
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const apply = () => {
      queued = false;
      const y = Math.max(0, window.scrollY);
      el.style.transform = `translate3d(0, ${(y * speed).toFixed(2)}px, 0)`;
      if (fade) {
        el.style.opacity = String(Math.max(0, 1 - y / (vh * 0.8)));
      }
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(apply);
    };

    const onResize = () => {
      if (window.innerWidth !== vw) {
        vw = window.innerWidth;
        vh = window.innerHeight;
      }
      schedule();
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", schedule);
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
