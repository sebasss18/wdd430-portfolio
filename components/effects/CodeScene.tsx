"use client";

// Escritura progresiva de código sobre el fondo de la página.
// Mientras se escribe solo se ve el texto; al terminar se forma la caja de cristal.
// La escena conserva una paleta oscura independientemente del tema del sistema.
import { useEffect, useRef, useState } from "react";
import HiBanner from "@/components/effects/HiBanner";

const pattern = /("[^"]*"?|\bconst\b|\b\d+\b|\b[a-z]+(?=:)|[[\]{}:,=;])/g;

const DOTS = 48; // puntitos de la barra de progreso
const PUSH = 1200; // cuánto avanza el polvo por el espacio mientras se escribe

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => t * t * (3 - 2 * t);

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// polvo flotando en el espacio
const DUST = (() => {
  const r = rng(7);
  return Array.from({ length: 110 }, () => ({
    x: (r() - 0.5) * 3200,
    y: (r() - 0.5) * 1800,
    z: 600 - r() * (PUSH + 3400),
    s: 1.5 + r() * 2.5,
    o: 0.25 + r() * 0.5,
  }));
})();

// extrusión del código: [profundidad, opacidad]
const EXTRUDE: [number, number][] = [
  [-8, 0.22],
  [-16, 0.1],
];

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const tokenClass = (t: string) => {
  if (t.startsWith('"')) return "text-slate-100";
  if (t === "const") return "italic text-slate-400";
  if (/^\d+$/.test(t)) return "font-bold text-slate-100";
  if (/^[[\]{}:,=;]$/.test(t)) return "text-slate-600";
  return "text-slate-300";
};

function Lines({
  text,
  cursor,
  ghost = false,
}: {
  text: string;
  cursor: boolean;
  ghost?: boolean;
}) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const active = cursor && i === lines.length - 1;
        return (
          <div key={i} className="flex gap-4 sm:gap-8">
            <span
              className={`w-4 shrink-0 select-none text-right ${
                ghost ? "" : active ? "text-slate-100" : "text-slate-600"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`min-w-0 flex-1 whitespace-pre-wrap break-words ${
                ghost ? "" : "text-slate-300"
              }`}
            >
              {ghost
                ? line
                : line.split(pattern).map((p, j) =>
                    j % 2 === 1 ? (
                      <span key={j} className={tokenClass(p)}>
                        {p}
                      </span>
                    ) : (
                      <span key={j}>{p}</span>
                    ),
                  )}
              {active && !ghost && (
                <span className="ml-0.5 inline-block h-[1.1em] w-[0.55ch] translate-y-[0.2em] animate-pulse bg-slate-100" />
              )}
            </span>
          </div>
        );
      })}
    </>
  );
}

export default function CodeScene({ code }: { code: string }) {
  const ref = useRef<HTMLElement>(null);
  const spaceWrap = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const grain = useRef<HTMLDivElement>(null);
  const dustEls = useRef<(HTMLSpanElement | null)[]>([]);
  const dustBlur = useRef<number[]>(DUST.map(() => -1));
  const prog = useRef(0);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  // arranca la escritura cuando la escena entra en pantalla
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setCount(code.length), 0);
      return () => clearTimeout(id);
    }

    const resetId = setTimeout(() => setCount(0), 0);
    let i = 0;
    let id: ReturnType<typeof setTimeout>;

    const step = () => {
      i++;
      setCount(i);
      if (i >= code.length) return;
      const ch = code[i - 1];
      const delay =
        ch === "\n" ? 240 : ",;{[".includes(ch) ? 120 : 24 + Math.random() * 30;
      id = setTimeout(step, delay);
    };

    id = setTimeout(step, 600);
    return () => {
      clearTimeout(resetId);
      clearTimeout(id);
    };
  }, [started, code]);

  useEffect(() => {
    prog.current = code.length ? count / code.length : 0;
  }, [count, code.length]);

  // cámara: el polvo avanza con lo escrito y el panel sigue un poco al mouse
  useEffect(() => {
    const el = ref.current;
    const wd = world.current;
    const pn = panel.current;
    if (!el || !wd || !pn) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const mouse = { tx: 0, ty: 0, x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce) window.addEventListener("pointermove", onMove);

    let raf = 0;
    let alive = false;
    let zc = 0;
    let lastZ = -9999;
    let frames = 0;

    const frame = (time: number) => {
      if (!alive) return;

      // el espacio se funde con la página al entrar y salir de la sección
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const fo = (
        ease(clamp((vh - r.top) / (vh * 0.7))) *
        ease(clamp(r.bottom / (vh * 0.7)))
      ).toFixed(3);
      if (spaceWrap.current) spaceWrap.current.style.opacity = fo;
      if (grain.current)
        grain.current.style.opacity = (Number(fo) * 0.07).toFixed(3);

      const target = prog.current * PUSH;
      zc = reduce ? target : zc + (target - zc) * 0.04;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      let ry = mouse.x * 3;
      let rx = -mouse.y * 2;
      let rz = 0;
      if (!reduce) {
        ry += Math.sin(time * 0.0004) * 0.6;
        rx += Math.cos(time * 0.00055) * 0.4;
        rz = Math.sin(time * 0.0003) * 0.25;
      }

      wd.style.transform = `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) translate3d(0, 0, ${zc.toFixed(1)}px)`;
      pn.style.transform = `perspective(1600px) rotateX(${(rx * 1.4).toFixed(3)}deg) rotateY(${(ry * 1.8).toFixed(3)}deg) translateZ(${(zc * 0.03).toFixed(1)}px)`;

      // polvo: opacidad y blur de profundidad (solo si la cámara se movió)
      if (Math.abs(zc - lastZ) > 1.5) {
        lastZ = zc;
        for (let k = 0; k < DUST.length; k++) {
          const dn = dustEls.current[k];
          if (!dn) continue;
          const d = DUST[k].z + zc;
          let o: number;
          let b: number;
          if (d >= 0) {
            o = clamp(1 - d / 450);
            b = clamp(d / 450) * 5;
          } else {
            o = clamp(1 + d / 3000);
            b = clamp(-d / 2200) * 2.5;
          }
          o *= DUST[k].o;
          dn.style.visibility = o < 0.01 ? "hidden" : "visible";
          dn.style.opacity = o.toFixed(3);
          const q = Math.round(b * 2) / 2;
          if (q !== dustBlur.current[k]) {
            dustBlur.current[k] = q;
            dn.style.filter = q > 0 ? `blur(${q}px)` : "none";
          }
        }
      }

      frames++;
      if (!reduce && grain.current && frames % 4 === 0) {
        grain.current.style.backgroundPosition = `${Math.random() * 160}px ${Math.random() * 160}px`;
      }
      raf = requestAnimationFrame(frame);
    };

    // solo corre mientras la escena está en pantalla
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) {
        if (!alive) {
          alive = true;
          lastZ = -9999;
          raf = requestAnimationFrame(frame);
        }
      } else {
        alive = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const done = count >= code.length;
  const typed = code.slice(0, count);
  const rows = typed.split("\n");
  const ln = rows.length;
  const col = rows[rows.length - 1].length + 1;
  const pad = (v: number) => String(v).padStart(2, "0");

  const filled = Math.floor((count / code.length) * DOTS);

  // la caja aparece al terminar, cada capa con su propio fade (así no se aplana el 3D)
  const form = (delay: number) => ({
    opacity: done ? 1 : 0,
    transition: `opacity 1400ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 px-5 py-24 text-slate-100 [--fg:255,255,255] sm:px-16"
    >
      {/* espacio 3D: polvo con blur de profundidad */}
      <div
        ref={spaceWrap}
        className="pointer-events-none absolute inset-0"
        style={{ perspective: "1000px", opacity: 0 }}
        aria-hidden="true"
      >
        <div
          ref={world}
          className="absolute left-1/2 top-1/2 h-0 w-0 will-change-transform [transform-style:preserve-3d]"
        >
          {DUST.map((p, k) => (
            <span
              key={k}
              ref={(el) => {
                dustEls.current[k] = el;
              }}
              className="absolute left-0 top-0 block rounded-full bg-slate-100"
              style={{
                width: p.s,
                height: p.s,
                opacity: 0,
                visibility: "hidden",
                transform: `translate3d(${p.x.toFixed(0)}px, ${p.y.toFixed(0)}px, ${p.z.toFixed(0)}px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* grano de película */}
      <div
        ref={grain}
        className="pointer-events-none absolute -inset-10 z-10"
        style={{ backgroundImage: GRAIN, opacity: 0 }}
      />

      <div className="relative z-20 mx-auto w-full max-w-5xl">
        <p className="font-label text-[10px] uppercase tracking-[0.3em] text-slate-400 sm:text-xs">
          The short version
        </p>

        {/* panel: mientras se escribe solo se ve el texto; al terminar se forma la caja */}
        <div
          ref={panel}
          className="relative mt-5 [transform-style:preserve-3d] sm:mt-8"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-16 block rounded-full sm:-inset-24"
            style={{
              transform: "translateZ(-140px)",
              background:
                "radial-gradient(circle, rgba(var(--fg),0.08) 0%, transparent 62%)",
              ...form(500),
            }}
          />
          {/* capas en profundidad: mientras más al fondo, más blur (como PathScroll) */}
          {[0.12, 0.08, 0.05].map((o, k) => (
            <span
              key={k}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 block rounded-2xl border"
              style={{
                borderColor: `rgba(var(--fg),${(o * 1.4).toFixed(3)})`,
                transform: `translateZ(${-24 * (k + 1)}px)`,
                filter: k > 0 ? `blur(${k * 1.5}px)` : undefined,
                ...form(350 + k * 200),
              }}
            />
          ))}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 block rounded-2xl border border-white/15 bg-slate-900/70"
            style={form(0)}
          />

          <div
            className="[transform-style:preserve-3d]"
            style={{ transform: "translateZ(28px)" }}
          >
            <div style={form(300)}>
              <div className="font-label grid grid-cols-[1fr_auto] items-center px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-slate-400 sm:px-8 sm:py-4 sm:text-xs">
                <span className="translate-y-[6px]">sebastian.ts</span>
                <span className="translate-y-[6px] tabular-nums">
                  Done · LN {pad(ln)} COL {pad(col)}
                </span>
              </div>
              <div className="mx-4 h-px bg-slate-700 sm:mx-8" />
            </div>

            <div className="relative font-mono text-[12px] leading-relaxed [transform-style:preserve-3d] sm:text-base sm:leading-loose lg:text-xl lg:leading-loose">
              <pre className="sr-only">{code}</pre>
              <div
                aria-hidden="true"
                className="invisible px-4 py-4 sm:px-8 sm:py-8"
              >
                <Lines text={code} cursor={false} />
              </div>

              {/* capas de extrusión del código */}
              {EXTRUDE.map(([z, alpha], k) => (
                <div
                  key={k}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 px-4 py-4 text-slate-100 sm:px-8 sm:py-8"
                  style={{ opacity: alpha, transform: `translateZ(${z}px)` }}
                >
                  <Lines text={typed} cursor={false} ghost />
                </div>
              ))}

              <div
                aria-hidden="true"
                className="absolute inset-0 px-4 py-4 sm:px-8 sm:py-8"
                style={{ transform: "translateZ(8px)" }}
              >
                <Lines text={typed} cursor={started} />
              </div>
            </div>

            {/* progreso: puntitos que se encienden (aparecen con la caja) */}
            <div
              aria-hidden="true"
              className="mx-4 flex items-center justify-between pb-5 pt-2 sm:mx-8 sm:pb-8"
              style={form(300)}
            >
              {Array.from({ length: DOTS }).map((_, i) => {
                const on = i < filled || done;
                return (
                  <span
                    key={i}
                    className={`block h-[3px] w-[3px] rounded-full transition-all duration-300 ${
                      on ? "bg-slate-100" : "bg-slate-100/20"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div
          className={`mt-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-16 ${
            done
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-6 opacity-0"
          }`}
        >
          <HiBanner href="/contact" />
        </div>
      </div>
    </section>
  );
}
