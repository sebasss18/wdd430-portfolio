"use client";

import { useEffect, useRef, useState } from "react";

const interactive =
  "a, button, [role='button'], input, textarea, select, label, [data-cursor]";
const outlineSel = "input, textarea, select, [data-cursor='outline']";

const BASE = 8; // tamaño del cuadrito en reposo
const MAX_STRETCH = 96; // estiramiento máximo (px)
const PAD = 2; // holgura alrededor del elemento
const MAX_W = 520; // elementos más grandes no se fijan
const MAX_H = 360;
const STIFF = 240; // rigidez del resorte hover
const DAMP = 20; // amortiguación (menos = más rebote)

const BODY_N = 14; // puntos de quiebre del cuerpo líquido
const BODY_RATE = 260; // qué tan pegado sigue cada punto al anterior (menos = más largo y flojo)
const BODY_TAPER = 0.55; // los últimos puntos van más flojos (1 = todos igual)

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const fx = (v: number) => v.toFixed(1);

function readRadius(el: Element) {
  const raw = getComputedStyle(el).borderTopLeftRadius;
  return { v: parseFloat(raw) || 0, pct: raw.trim().endsWith("%") };
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const shapeRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const shape = shapeRef.current;
    const fill = fillRef.current;
    const body = bodyRef.current;
    if (!shape || !fill || !body) return;

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Estado mutable (sin React)
    let px = -100,
      py = -100; // puntero
    let angle = 0;
    let k = 0,
      kv = 0; // 0 = reposo, 1 = fijado (resorte)
    let p = 0,
      pT = 0; // presionado
    let vis = 0,
      visT = 0; // visibilidad
    let fillV = 1; // 1 = relleno, 0 = solo contorno
    let seen = false,
      rescan = false;
    let raf = 0,
      last = 0,
      quiet = 0;
    let target: Element | null = null;
    let lastNode: Node | null = null;
    let radius = { v: 0, pct: false };
    let outline = false;
    const er = { l: 0, t: 0, w: 0, h: 0 }; // último rect válido del elemento

    // Cadena del cuerpo: el punto 0 es el puntero, los demás lo siguen
    const bx = new Float64Array(BODY_N).fill(-100);
    const by = new Float64Array(BODY_N).fill(-100);
    const LINK = MAX_STRETCH / (BODY_N - 1);

    const acquire = (el: Element | null) => {
      if (el === target) return;
      target = el;
      if (el) {
        radius = readRadius(el);
        outline = el.matches(outlineSel);
      }
    };

    const frame = (now: number) => {
      const dt = clamp((now - last) / 1000, 0.001, 1 / 30);
      last = now;
      const reduced = rm.matches;
      const damp = (l: number) => 1 - Math.exp(-l * dt);

      // 1) LECTURAS
      if (rescan) {
        rescan = false;
        const el = document.elementFromPoint(px, py);
        lastNode = el;
        acquire(el?.closest(interactive) ?? null);
      }
      if (target && !target.isConnected) {
        acquire(null);
        lastNode = null;
      }

      let fits = false;
      let rd = 0;
      if (target) {
        const r = target.getBoundingClientRect();
        fits =
          r.width > 0 && r.height > 0 && r.width <= MAX_W && r.height <= MAX_H;
        if (fits) {
          const nl = r.left - PAD,
            nt = r.top - PAD;
          const nw = r.width + PAD * 2,
            nh = r.height + PAD * 2;
          rd =
            Math.abs(nl - er.l) +
            Math.abs(nt - er.t) +
            Math.abs(nw - er.w) +
            Math.abs(nh - er.h);
          er.l = nl;
          er.t = nt;
          er.w = nw;
          er.h = nh;
        }
      }

      // 2) FÍSICA
      // Cadena: cada punto persigue al anterior, así el cuerpo dobla siguiendo la trayectoria
      bx[0] = px;
      by[0] = py;
      let len = 0;
      for (let i = 1; i < BODY_N; i++) {
        if (reduced) {
          bx[i] = px;
          by[i] = py;
          continue;
        }
        const a = damp(BODY_RATE * lerp(1, BODY_TAPER, i / (BODY_N - 1)));
        bx[i] += (bx[i - 1] - bx[i]) * a;
        by[i] += (by[i - 1] - by[i]) * a;
        const ddx = bx[i - 1] - bx[i];
        const ddy = by[i - 1] - by[i];
        const d = Math.hypot(ddx, ddy);
        if (d > LINK) {
          bx[i] = bx[i - 1] - (ddx / d) * LINK;
          by[i] = by[i - 1] - (ddy / d) * LINK;
          len += LINK;
        } else {
          len += d;
        }
      }

      // Orientación de la cabeza: hacia donde apunta el cuerpo
      const ref = Math.min(3, BODY_N - 1);
      const adx = bx[0] - bx[ref];
      const ady = by[0] - by[ref];
      if (Math.hypot(adx, ady) > 0.8)
        angle = (Math.atan2(ady, adx) * 180) / Math.PI;

      const kT = fits ? 1 : 0;
      if (reduced) {
        k = kT;
        kv = 0;
      } else {
        kv += ((kT - k) * STIFF - kv * DAMP) * dt;
        k += kv * dt;
      }
      const fillT = fits && outline ? 0 : 1;
      p += (pT - p) * damp(30);
      vis += (visT - vis) * damp(18);
      fillV += (fillT - fillV) * damp(20);

      // 3) FORMA: cápsula líquida en reposo <-> rect del elemento
      const L = BASE + len;
      const H = BASE * clamp(Math.sqrt(BASE / L), 0.4, 1);

      const kc = clamp(k, -0.04, 1.08);
      const k01 = clamp(k, 0, 1);
      const w = Math.max(1, lerp(H, er.w, kc));
      const h = Math.max(1, lerp(H, er.h, kc));
      const cx = lerp(px, er.l + er.w / 2, kc);
      const cy = lerp(py, er.t + er.h / 2, kc);

      const rEl = Math.min(
        radius.pct ? (radius.v / 100) * Math.min(er.w, er.h) : radius.v + PAD,
        Math.min(er.w, er.h) / 2,
      );
      const r = lerp(Math.min(2, H / 2), rEl, k01);

      const rotDraw = ((((angle + 90) % 180) + 180) % 180) - 90;
      const rot = lerp(rotDraw, 0, k01);
      const sc = lerp(1 - 0.4 * p, 1 - 0.05 * p, k01);

      // Cuerpo: línea suave por todos los puntos, con grosor = H
      let d = `M${fx(bx[0])} ${fx(by[0])}`;
      for (let i = 1; i < BODY_N - 1; i++) {
        d += `Q${fx(bx[i])} ${fx(by[i])} ${fx((bx[i] + bx[i + 1]) / 2)} ${fx((by[i] + by[i + 1]) / 2)}`;
      }
      d += `L${fx(bx[BODY_N - 1])} ${fx(by[BODY_N - 1])}`;

      // 4) ESCRITURAS
      shape.style.width = `${w}px`;
      shape.style.height = `${h}px`;
      shape.style.borderRadius = `${r}px`;
      shape.style.opacity = `${vis}`;
      shape.style.transform = `translate3d(${cx - w / 2}px, ${cy - h / 2}px, 0) rotate(${rot}deg) scale(${sc})`;
      fill.style.opacity = `${fillV}`;

      body.setAttribute("d", d);
      body.setAttribute("stroke-width", `${H * (1 - 0.4 * p)}`);
      body.style.opacity = `${vis * (1 - k01)}`;

      // 5) ¿SEGUIMOS O DORMIMOS?
      const energy =
        len +
        Math.abs(kT - k) * 50 +
        Math.abs(kv) +
        Math.abs(pT - p) * 10 +
        Math.abs(visT - vis) * 10 +
        Math.abs(fillT - fillV) * 10 +
        rd +
        (rescan ? 1 : 0);
      quiet = energy > 0.02 ? 0 : quiet + 1;
      const hold = fits ? 45 : 2; // fijado: sigue un rato por si el elemento anima
      raf = quiet > hold ? 0 : requestAnimationFrame(frame);
    };

    const wake = () => {
      quiet = 0;
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!seen) {
        seen = true;
        bx.fill(px);
        by.fill(py);
      }
      visT = 1;
      const node = e.target as Element | null;
      if (node !== lastNode) {
        lastNode = node;
        acquire(node?.closest(interactive) ?? null);
      }
      wake();
    };
    const down = () => {
      pT = 1;
      wake();
    };
    const up = () => {
      pT = 0;
      wake();
    };
    const leave = () => {
      visT = 0;
      seen = false;
      pT = 0;
      wake();
    };
    const onScroll = () => {
      rescan = true;
      wake();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onScroll);
    window.addEventListener("transitionrun", wake, true);
    document.documentElement.addEventListener("mouseleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("transitionrun", wake, true);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`html, html * { cursor: none !important; }`}</style>

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference"
      >
        <svg className="absolute inset-0 h-full w-full overflow-visible">
          <path
            ref={bodyRef}
            fill="none"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={BASE}
            style={{ opacity: 0 }}
          />
        </svg>

        <div
          ref={shapeRef}
          className="absolute left-0 top-0 border border-white"
          style={{
            width: BASE,
            height: BASE,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          <div
            ref={fillRef}
            className="absolute inset-0 rounded-[inherit] bg-white"
          />
        </div>
      </div>
    </>
  );
}
