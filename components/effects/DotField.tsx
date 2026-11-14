"use client";

import { useEffect, useRef } from "react";

const dots = (a: number) =>
  `radial-gradient(circle, rgb(128 128 128 / ${a}) 1px, transparent 1px)`;
const fade = "radial-gradient(ellipse at center, black 30%, transparent 72%)";
const spot =
  "radial-gradient(240px circle at var(--mx, 50%) var(--my, 40%), black, transparent)";

export default function DotField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0.5;
    let y = 0.4;
    let tx = 0.5;
    let ty = 0.4;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
    };

    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
      raf = requestAnimationFrame(tick);
    };

    host.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: dots(0.35),
          backgroundSize: "22px 22px",
          maskImage: fade,
          WebkitMaskImage: fade,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: dots(0.95),
          backgroundSize: "22px 22px",
          maskImage: spot,
          WebkitMaskImage: spot,
        }}
      />
    </div>
  );
}
