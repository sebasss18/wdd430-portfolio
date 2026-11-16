"use client";

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Item = {
  title: string;
  text: string;
  icon: ReactNode;
};

type FloorCell = { x: number; h: number; a: number };
type DustPoint = {
  x: number;
  y: number;
  z: number;
  s: number;
  o: number;
  // deriva suave (animación CSS en el compositor, no cuesta nada en JS)
  dx: number;
  dy: number;
  dz: number;
  t: number;
  dl: number;
  c?: boolean; // brasa ámbar
};
type Refs<T> = { current: (T | null)[] };

const GAP = 1500; // distancia en profundidad entre un hobby y el siguiente
const LINE_STEP = 140; // separación de las luces del piso
// La cámara arranca "antes" del primer hobby (en unidades de hobby): al entrar a la
// sección el primero se ve lejos, entre la niebla, y se va acercando con el scroll.
const LEAD = 0.7;
const FLOOR_Z0 = 400 + LEAD * GAP; // z de la primera fila del piso

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

// ruta de la cámara: cada hobby queda un poco a un lado, la cámara serpentea
const fx = (i: number) => (i % 2 === 0 ? -1 : 1) * 0.3;
const fy = (i: number) => ((i % 3) - 1) * 0.18;

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const GRAIN_SRC =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";
const GRAIN = `url("${GRAIN_SRC}")`;

// Todas las filas del piso son idénticas: se dibujan una sola vez en un bitmap
// y cada fila es un único elemento con ese fondo (en vez de ~40 nodos por fila).
const FLOOR_PAD = 16;
const FLOOR_HALF = 9 * 160; // 1440
const FLOOR_W = FLOOR_HALF * 2 + 1 + FLOOR_PAD * 2;
const FLOOR_H = 130 + FLOOR_PAD * 2;
const FLOOR_OX = FLOOR_PAD + FLOOR_HALF; // origen (x=0) dentro del bitmap
const FLOOR_OY = 130 + FLOOR_PAD; // base de los rayos dentro del bitmap

const floorCells = (): FloorCell[] =>
  Array.from({ length: 19 }, (_, c) => {
    const m = Math.abs(c - 9);
    return { x: (c - 9) * 160, h: 130 - m * 8, a: clamp(1 - m / 11) };
  });

const DROP = "drop-shadow(0 0 14px rgba(var(--amb),0.45))";

// Texto: el blur del título se pinta como text-shadow (sigma = radio / 2, así que
// radio = 2 * blur) con el relleno transparente. Es el mismo resultado visual que
// filter: blur(), pero queda horneado en la textura de la capa en vez de
// recalcularse en la GPU en cada frame (eso era lo que tiraba los fps en pantalla
// completa, donde el título llega a 11rem).
// --bf: blur para capas normales ("none" cuando está enfocado: sin filtro = sin
// superficie extra en la GPU). --bs: lo mismo pero con el brillo ámbar del icono.
const vars = () =>
  ({
    "--o": 0,
    "--f": 0,
    "--bf": "none",
    "--bs": DROP,
    "--ts": "none",
    "--tf": "currentColor",
  }) as CSSProperties;

type SceneProps = {
  items: Item[];
  n: number;
  lineCount: number;
  dust: DustPoint[];
  itemEls: Refs<HTMLDivElement>;
  dustEls: Refs<HTMLSpanElement>;
  lineEls: Refs<HTMLSpanElement>;
  world: { current: HTMLDivElement | null };
};

// La escena es estática para React: todo el movimiento se escribe directo al DOM.
// Con memo, cambiar el hobby activo ya no reconcilia miles de nodos.
const Scene = memo(function Scene({
  items,
  n,
  lineCount,
  dust,
  itemEls,
  dustEls,
  lineEls,
  world,
}: SceneProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ perspective: "1000px" }}
      aria-hidden="true"
    >
      {/* `translate` es independiente de `transform`: la deriva se suma a la posición base */}
      <style>{`@keyframes ps-drift{from{translate:0 0 0}to{translate:var(--dx) var(--dy) var(--dz)}}.ps-dust{animation:ps-drift 10s ease-in-out infinite alternate}[data-ps-idle] .ps-dust{animation-play-state:paused}@media (prefers-reduced-motion:reduce){.ps-dust{animation:none}}`}</style>
      <div
        ref={world}
        className="absolute left-1/2 top-1/2 h-0 w-0 will-change-transform [transform-style:preserve-3d]"
      >
        {/* suelo de puntos con rayos que se desvanecen hacia arriba */}
        {Array.from({ length: lineCount }, (_, k) => (
          <span
            key={k}
            ref={(el) => {
              lineEls.current[k] = el;
            }}
            className="absolute left-0 top-0 block"
            style={{
              width: FLOOR_W,
              height: FLOOR_H,
              backgroundSize: "100% 100%",
              opacity: 0,
              visibility: "hidden",
              transform: `translate3d(${-FLOOR_OX}px, calc(44svh - ${FLOOR_OY}px), ${FLOOR_Z0 - k * LINE_STEP}px)`,
            }}
          />
        ))}

        {/* polvo y brasas: flotan con una deriva lenta */}
        {dust.map((p, k) => (
          <span
            key={k}
            ref={(el) => {
              dustEls.current[k] = el;
            }}
            className={`ps-dust absolute left-0 top-0 block rounded-full ${p.c ? "" : "bg-slate-100"}`}
            style={
              {
                width: p.s,
                height: p.s,
                opacity: 0,
                visibility: "hidden",
                transform: `translate3d(${p.x.toFixed(0)}px, ${p.y.toFixed(0)}px, ${p.z.toFixed(0)}px)`,
                background: p.c
                  ? "radial-gradient(circle, rgba(var(--amb),0.95) 0%, rgba(var(--amb),0.35) 40%, transparent 70%)"
                  : undefined,
                "--dx": `${p.dx.toFixed(0)}px`,
                "--dy": `${p.dy.toFixed(0)}px`,
                "--dz": `${p.dz.toFixed(0)}px`,
                animationDuration: `${p.t.toFixed(1)}s`,
                animationDelay: `${p.dl.toFixed(1)}s`,
              } as CSSProperties
            }
          />
        ))}

        {/* hobbies */}
        {items.map((it, i) => (
          <div
            key={it.title}
            ref={(el) => {
              itemEls.current[i] = el;
            }}
            className="absolute left-0 top-0 flex w-[100vw] flex-col items-center px-6 text-center [transform-style:preserve-3d]"
            style={{
              ...vars(),
              visibility: "hidden",
              transform: `translate3d(calc(${fx(i)} * 50vw), calc(${fy(i)} * 50svh), ${-i * GAP}px) translate(-50%, -50%)`,
            }}
          >
            {/* luz ámbar detrás del hobby en foco */}
            <span
              data-glow=""
              className="absolute left-1/2 top-1/2 block aspect-square w-[90vw] rounded-full"
              style={{
                transform: "translate3d(-50%, -50%, -160px)",
                opacity: "calc(var(--f) * 0.5)",
                background:
                  "radial-gradient(circle, rgba(var(--amb),0.2) 0%, transparent 62%)",
              }}
            />

            <p
              className="mb-4 text-[10px] uppercase tracking-[0.35em] text-slate-400 sm:mb-6 sm:text-xs"
              style={{
                opacity: "calc(var(--o) * 0.9)",
                transform: "translateZ(30px)",
              }}
            >
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </p>

            {/* icono con grosor: capas separadas en profundidad */}
            <div className="relative mb-6 aspect-square w-[min(40vw,16rem)] [transform-style:preserve-3d] sm:mb-8 sm:w-[min(24vw,16rem)]">
              {[1, 0.5, 0.3, 0.15].map((alpha, k) => (
                <svg
                  key={k}
                  viewBox="0 0 24 24"
                  className="absolute inset-0 h-full w-full"
                  fill="none"
                  strokeWidth="0.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    stroke: k === 0 ? "rgb(var(--fg))" : "rgb(var(--amb))",
                    transform: `translateZ(${40 - 26 * k}px)`,
                    opacity: `calc(var(--o) * ${alpha})`,
                    filter: k === 0 ? "var(--bs)" : "var(--bf)",
                  }}
                >
                  {it.icon}
                </svg>
              ))}
            </div>

            {/* título con extrusión ámbar */}
            <h3 className="relative whitespace-nowrap text-[clamp(3rem,12vw,11rem)] font-bold leading-none tracking-tighter [transform-style:preserve-3d]">
              <span
                className="block"
                style={{
                  opacity: "var(--o)",
                  textShadow: "var(--ts)",
                  WebkitTextFillColor: "var(--tf)",
                }}
              >
                {it.title}
              </span>
              {[0.45, 0.25, 0.12].map((alpha, k) => (
                <span
                  key={k}
                  aria-hidden="true"
                  className="absolute inset-0 block"
                  style={{
                    color: "rgb(var(--amb))",
                    transform: `translateZ(${-20 * (k + 1)}px)`,
                    opacity: `calc(var(--o) * ${alpha})`,
                    textShadow: "var(--ts)",
                    WebkitTextFillColor: "var(--tf)",
                  }}
                >
                  {it.title}
                </span>
              ))}
            </h3>

            <p
              className="mt-6 max-w-md text-sm leading-relaxed text-slate-300 sm:mt-8 sm:text-lg"
              style={{
                opacity: "var(--f)",
                transform: "translateZ(50px)",
              }}
            >
              {it.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default function PathScroll({
  items,
  label,
}: {
  items: Item[];
  label: string;
}) {
  const n = items.length;
  const section = useRef<HTMLElement>(null);
  const stick = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const grain = useRef<HTMLDivElement>(null);
  const itemEls = useRef<(HTMLDivElement | null)[]>([]);
  const dustEls = useRef<(HTMLSpanElement | null)[]>([]);
  const lineEls = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const depth = (n - 1) * GAP;

  // polvo flotando en el espacio: da escala y velocidad a la cámara
  const dust = useMemo<DustPoint[]>(() => {
    const span = depth + 3400 + LEAD * GAP;
    const zAt = (r: () => number) => 600 + LEAD * GAP - r() * span;
    const dr = rng(11);
    const drift = () => ({
      dx: (dr() - 0.5) * 240,
      dy: (dr() - 0.5) * 160,
      dz: (dr() - 0.5) * 500,
      t: 7 + dr() * 9,
      dl: -dr() * 16,
    });

    // las 150 originales (mismas posiciones)
    const r = rng(7);
    const base = Array.from({ length: 150 }, () => ({
      x: (r() - 0.5) * 3200,
      y: (r() - 0.5) * 1800,
      z: zAt(r),
      s: 1.5 + r() * 2.5,
      o: 0.25 + r() * 0.5,
      ...drift(),
    }));

    // más polvo fino para dar profundidad
    const r2 = rng(13);
    const extra = Array.from({ length: 210 }, () => ({
      x: (r2() - 0.5) * 3000,
      y: (r2() - 0.5) * 1700,
      z: zAt(r2),
      s: 1.2 + r2() * 2.4,
      o: 0.2 + r2() * 0.45,
      ...drift(),
    }));

    // brasas ámbar con halo suave
    const r3 = rng(19);
    const embers = Array.from({ length: 40 }, () => ({
      x: (r3() - 0.5) * 2600,
      y: (r3() - 0.5) * 1500,
      z: zAt(r3),
      s: 8 + r3() * 8,
      o: 0.4 + r3() * 0.5,
      c: true,
      ...drift(),
    }));

    return [...base, ...extra, ...embers];
  }, [depth]);

  const lineCount = Math.ceil((depth + 3800 + LEAD * GAP) / LINE_STEP);

  // bitmap compartido del piso (mismo dibujo que los rayos y puntos originales)
  useEffect(() => {
    const rows = lineEls.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const c = document.createElement("canvas");
    c.width = Math.round(FLOOR_W * dpr);
    c.height = Math.round(FLOOR_H * dpr);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.translate(FLOOR_OX, FLOOR_OY);
    const OFF = 4000; // el punto se dibuja fuera del lienzo y solo su sombra entra
    for (const q of floorCells()) {
      ctx.globalAlpha = q.a;
      const g = ctx.createLinearGradient(0, 0, 0, -q.h);
      g.addColorStop(0, "rgba(255,255,255,0.5)");
      g.addColorStop(0.35, "rgba(255,255,255,0.1)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(q.x, -q.h, 1, q.h);

      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 6 * dpr;
      ctx.shadowOffsetX = OFF * dpr;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(q.x + 0.5 - OFF, -0.5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = "rgba(241,245,249,0.8)";
      ctx.beginPath();
      ctx.arc(q.x + 0.5, -0.5, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    let dead = false;
    let url = "";
    c.toBlob((blob) => {
      if (!blob || dead) return;
      url = URL.createObjectURL(blob);
      for (const r of rows) if (r) r.style.backgroundImage = `url(${url})`;
    });
    return () => {
      dead = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [lineCount]);

  // El grano se rasteriza una sola vez a un PNG (mismo SVG, mismo aspecto):
  // así el navegador no vuelve a evaluar feTurbulence al mover la capa.
  useEffect(() => {
    const g = grain.current;
    if (!g) return;
    let dead = false;
    let url = "";
    const img = new Image();
    img.onload = () => {
      if (dead) return;
      const c = document.createElement("canvas");
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(160 * dpr);
      c.height = Math.round(160 * dpr);
      const ctx = c.getContext("2d");
      if (!ctx) return;
      try {
        ctx.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob((b) => {
          if (!b || dead) return;
          url = URL.createObjectURL(b);
          g.style.backgroundImage = `url(${url})`;
          g.style.backgroundSize = "160px 160px";
        });
      } catch {
        /* si falla se queda el SVG original */
      }
    };
    img.src = GRAIN_SRC;
    return () => {
      dead = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  useEffect(() => {
    const el = section.current;
    const st = stick.current;
    const wd = world.current;
    if (!el || !st || !wd) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const mobile = window.matchMedia("(max-width: 639px)").matches;

    // DIAGNÓSTICO (borrar después): ?off=floor,dust,blur,glow,grain,scene
    const off = new Set(
      (new URLSearchParams(window.location.search).get("off") ?? "")
        .split(",")
        .filter(Boolean),
    );
    const hide = (e: HTMLElement | null | undefined) => {
      if (e) e.style.display = "none";
    };
    if (off.has("floor")) lineEls.current.forEach(hide);
    if (off.has("dust")) dustEls.current.forEach(hide);
    if (off.has("grain") || mobile) hide(grain.current);
    if (off.has("glow"))
      st.querySelectorAll<HTMLElement>("[data-glow]").forEach(hide);
    if (off.has("scene")) hide(wd);
    const noBlur = off.has("blur") || mobile;

    const mouse = { tx: 0, ty: 0, x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduce)
      window.addEventListener("pointermove", onMove, { passive: true });

    // medidas cacheadas: nada de leer layout en medio del frame
    let vh = window.innerHeight;
    let hw = 0;
    let hh = 0;
    let total = 0;
    const measure = () => {
      vh = window.innerHeight;
      hw = st.clientWidth / 2;
      hh = st.clientHeight / 2;
      total = el.offsetHeight - st.offsetHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(st);
    window.addEventListener("resize", measure);

    // cachés de lo último escrito al DOM (centinelas para forzar la primera escritura)
    const itemCache = Array.from({ length: n }, () => ({
      v: "",
      o: "",
      f: "",
      b: -1,
    }));
    const lineCache = Array.from({ length: lineCount }, () => ({
      v: "",
      o: "",
    }));
    const dustCache = dust.map(() => ({ v: "", o: "" }));

    let raf = 0;
    let alive = false;
    let cur = -1;
    let lastP = -1;
    let lastIdx = -1;
    let prevTime = 0;
    let frames = 0;
    let worldTransform = "";
    let fadeValue = "";
    let maskValue = "";

    // Bordes difuminados al entrar y salir de la sección: el borde de arriba se
    // funde mientras la escena entra, y el de abajo mientras sale. Ya anclada
    // (pinned) no hay máscara, así que no cuesta nada en el tramo principal.
    const SMOOTH = [
      [0, 0],
      [0.25, 0.16],
      [0.5, 0.5],
      [0.75, 0.84],
      [1, 1],
    ];
    const maskGradient = (mt: number, mb: number) => {
      const stops: string[] = [];
      if (mt > 0) {
        for (const [x, al] of SMOOTH)
          stops.push(`rgba(0,0,0,${al}) ${Math.round(mt * x)}px`);
      } else {
        stops.push("#000 0px");
      }
      if (mb > 0) {
        for (let i = SMOOTH.length - 1; i >= 0; i--) {
          const [x, al] = SMOOTH[i];
          stops.push(`rgba(0,0,0,${al}) calc(100% - ${Math.round(mb * x)}px)`);
        }
      } else {
        stops.push("#000 100%");
      }
      return `linear-gradient(to bottom, ${stops.join(", ")})`;
    };

    // la escena entra y sale fundiéndose con el fondo real de la página:
    // no hay colores fijos, solo opacidad según cuánto de la sección se ve
    const fade = (top: number, bottom: number) => {
      const o = ease(clamp((vh - top) / vh)) * ease(clamp(bottom / vh));
      const opacity = o.toFixed(3);
      if (fadeValue !== opacity) {
        fadeValue = opacity;
        st.style.opacity = opacity;
      }

      const F = vh * 0.4; // alto del degradado en los bordes
      const mt = Math.round((F * clamp(top / F)) / 4) * 4;
      const mb = Math.round((F * clamp((vh - bottom) / F)) / 4) * 4;
      const mask = mt === 0 && mb === 0 ? "none" : maskGradient(mt, mb);
      if (maskValue !== mask) {
        maskValue = mask;
        st.style.setProperty("mask-image", mask);
        st.style.setProperty("-webkit-mask-image", mask);
      }
    };

    // progreso de scroll (0..1) -> posición de la cámara en "hobbies" (empieza en -LEAD)
    const toA = (p: number) => p * (n - 1 + LEAD) - LEAD;

    const renderCamera = (p: number, time: number) => {
      const a = toA(p);
      // el serpenteo lateral solo empieza cuando la cámara llega al primer hobby
      const ac = Math.max(0, a);
      const i0 = clamp(Math.floor(ac), 0, n - 1);
      const i1 = Math.min(n - 1, i0 + 1);
      const t = ac - i0;
      const e = ease(t);
      const cx = mix(fx(i0), fx(i1), e) * hw;
      const cy = mix(fy(i0), fy(i1), e) * hh;

      // la cámara se inclina hacia las curvas y respira un poco
      const turn = Math.sin(Math.PI * t);
      let ry = (fx(i1) - fx(i0)) * turn * 7 + mouse.x * 2.5;
      let rx = -(fy(i1) - fy(i0)) * turn * 5 - mouse.y * 1.8;
      let rz = -(fx(i1) - fx(i0)) * turn * 2;
      if (!reduce) {
        ry += Math.sin(time * 0.0004) * 0.5;
        rx += Math.cos(time * 0.00055) * 0.35;
        rz += Math.sin(time * 0.0003) * 0.25;
      }
      const transform = `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) rotateZ(${rz.toFixed(3)}deg) translate3d(${(-cx).toFixed(1)}px, ${(-cy).toFixed(1)}px, ${(a * GAP).toFixed(1)}px)`;
      if (worldTransform !== transform) {
        worldTransform = transform;
        wd.style.transform = transform;
      }
    };

    // Solo se llama cuando el scroll realmente avanzó (opacidades/blur dependen
    // únicamente de `a`, no del tiempo), y corre a cada frame para ir
    // sincronizado con la cámara.
    const renderDetail = (p: number) => {
      const a = toA(p);

      // Cada hobby aparece entre la niebla, pasa por la cámara y se desvanece.
      for (let i = 0; i < n; i++) {
        const node = itemEls.current[i];
        if (!node) continue;
        const c = itemCache[i];
        const d = (a - i) * GAP;
        let o: number;
        let b: number;
        if (d >= 0) {
          o = clamp(1 - d / 420);
          b = clamp(d / 420) * 10;
        } else {
          o = Math.pow(clamp(1 + d / (GAP * 2.1)), 0.8);
          b = clamp(-d / GAP) * 5;
        }
        const vis = o < 0.01 ? "hidden" : "visible";
        if (vis === "hidden") {
          // oculto y ya oculto: no hay nada que escribir
          if (c.v !== "hidden") {
            c.v = "hidden";
            node.style.visibility = "hidden";
          }
          continue;
        }
        if (c.v !== vis) {
          c.v = vis;
          node.style.visibility = vis;
        }
        const f = clamp(1 - Math.abs(d) / (GAP * 0.35));
        const opacity = o.toFixed(3);
        const focus = f.toFixed(3);
        // pasos de 0.5px hasta 2px y de 1px después: menos repintados, mismo aspecto
        const blur = noBlur ? 0 : b < 2 ? Math.round(b * 2) / 2 : Math.round(b);
        if (c.o !== opacity) {
          c.o = opacity;
          node.style.setProperty("--o", opacity);
        }
        if (c.f !== focus) {
          c.f = focus;
          node.style.setProperty("--f", focus);
        }
        if (c.b !== blur) {
          c.b = blur;
          // sin blur => sin filtro (evita una superficie offscreen por capa)
          if (blur > 0) {
            node.style.setProperty("--bf", `blur(${blur}px)`);
            node.style.setProperty("--bs", `blur(${blur}px) ${DROP}`);
            node.style.setProperty("--ts", `0 0 ${blur * 2}px currentColor`);
            node.style.setProperty("--tf", "transparent");
          } else {
            node.style.setProperty("--bf", "none");
            node.style.setProperty("--bs", mobile ? "none" : DROP);
            node.style.setProperty("--ts", "none");
            node.style.setProperty("--tf", "currentColor");
          }
        }
      }

      // Luces del piso.
      for (let k = 0; k < lineCount; k++) {
        const ln = lineEls.current[k];
        if (!ln) continue;
        const c = lineCache[k];
        const d = FLOOR_Z0 - k * LINE_STEP + a * GAP;
        const o =
          d > 300
            ? 0
            : (d >= 0 ? 1 - d / 300 : clamp(1 + d / (GAP * 2.4))) * 0.7;
        const vis = o < 0.01 ? "hidden" : "visible";
        if (vis === "hidden") {
          if (c.v !== "hidden") {
            c.v = "hidden";
            ln.style.visibility = "hidden";
          }
          continue;
        }
        if (c.v !== vis) {
          c.v = vis;
          ln.style.visibility = vis;
        }
        const opacity = o.toFixed(3);
        if (c.o !== opacity) {
          c.o = opacity;
          ln.style.opacity = opacity;
        }
      }

      // Polvo.
      for (let k = 0; k < dust.length; k++) {
        const dn = dustEls.current[k];
        if (!dn) continue;
        const c = dustCache[k];
        const d = dust[k].z + a * GAP;
        const o =
          (d >= 0 ? clamp(1 - d / 450) : clamp(1 + d / (GAP * 2))) * dust[k].o;
        const vis = o < 0.01 ? "hidden" : "visible";
        if (vis === "hidden") {
          if (c.v !== "hidden") {
            c.v = "hidden";
            dn.style.visibility = "hidden";
          }
          continue;
        }
        if (c.v !== vis) {
          c.v = vis;
          dn.style.visibility = vis;
        }
        const opacity = o.toFixed(3);
        if (c.o !== opacity) {
          c.o = opacity;
          dn.style.opacity = opacity;
        }
      }

      const idx = clamp(Math.round(a), 0, n - 1);
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
    };

    const frame = (time: number) => {
      if (!alive) return;

      // una única lectura de layout por frame, antes de cualquier escritura
      const r = el.getBoundingClientRect();
      const tgt = total > 0 ? clamp(-r.top / total) : 0;

      // suavizado independiente de la tasa de refresco (60/120/144 Hz)
      const dt = prevTime ? Math.min(50, time - prevTime) : 16.667;
      prevTime = time;
      const k = dt / 16.667;
      cur =
        cur < 0 || reduce ? tgt : cur + (tgt - cur) * (1 - Math.pow(0.93, k));
      const m = 1 - Math.pow(0.95, k);
      mouse.x += (mouse.tx - mouse.x) * m;
      mouse.y += (mouse.ty - mouse.y) * m;

      fade(r.top, r.bottom);
      renderCamera(cur, time);
      if (Math.abs(cur - lastP) > 0.00001) {
        lastP = cur;
        renderDetail(cur);
      }

      frames++;
      if (!reduce && grain.current && frames % 4 === 0) {
        grain.current.style.transform = `translate3d(${Math.random() * 160}px, ${Math.random() * 160}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };

    // solo corre mientras la sección está en pantalla
    const io = new IntersectionObserver(([en]) => {
      st.toggleAttribute("data-ps-idle", !en.isIntersecting);
      if (en.isIntersecting) {
        if (!alive) {
          alive = true;
          prevTime = 0;
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
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
    };
  }, [n, dust, lineCount]);

  const go = (i: number) => {
    const el = section.current;
    const st = stick.current;
    if (!el || !st) return;
    const total = el.offsetHeight - st.offsetHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: top + total * ((i + LEAD) / (n - 1 + LEAD)),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={section}
      className="relative"
      style={{ height: `${(n + LEAD) * 120}svh` }}
    >
      {/* El pasillo conserva su fondo oscuro aunque cambie el tema del sistema. */}
      <div
        ref={stick}
        className="sticky top-0 h-svh overflow-hidden bg-slate-950 text-slate-100 [--amb:255,179,92] [--fg:255,255,255]"
        style={{ opacity: 0 }}
      >
        {/* escena 3D: la cámara avanza por un pasillo de hobbies */}
        <Scene
          items={items}
          n={n}
          lineCount={lineCount}
          dust={dust}
          itemEls={itemEls}
          dustEls={dustEls}
          lineEls={lineEls}
          world={world}
        />

        {/* lectura para lectores de pantalla */}
        <ul className="sr-only">
          {items.map((it) => (
            <li key={it.title}>
              {it.title}: {it.text}
            </li>
          ))}
        </ul>

        {/* grano de película (sin viñeta: oscurecer los bordes rompía la unión con la página) */}
        <div
          ref={grain}
          className="pointer-events-none absolute -inset-[160px] z-10 opacity-[0.07] will-change-transform"
          style={{ backgroundImage: GRAIN }}
        />

        {/* etiqueta y contador arriba, navegación abajo */}
        <div className="absolute inset-x-0 top-0 z-20 flex h-[6svh] items-center justify-between px-5 sm:h-[8svh] sm:px-16">
          <p className="font-label text-[10px] uppercase tracking-[0.3em] text-slate-400 sm:text-xs">
            {label}
          </p>
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-slate-400 sm:text-xs">
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-[6svh] items-center justify-center gap-2 sm:h-[8svh]">
          {items.map((it, i) => (
            <button
              key={it.title}
              type="button"
              onClick={() => go(i)}
              aria-label={it.title}
              aria-current={i === active ? "true" : undefined}
              className="group flex h-8 items-center px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-100"
            >
              <span
                className={`block h-[2px] rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-10 bg-slate-100"
                    : "w-5 bg-slate-600 group-hover:bg-slate-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
