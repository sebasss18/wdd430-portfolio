"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  href: string;
  eyebrow?: string;
  title?: string;
};

// radio de la órbita, tamaño, duración (s) y ángulo inicial
const PLANETS = [
  { name: "Mercury", orbit: 86, size: 1.2, duration: 14, start: 20 },
  { name: "Venus", orbit: 95, size: 2, duration: 22, start: 140 },
  { name: "Earth", orbit: 104, size: 2.2, duration: 30, start: 250 },
  { name: "Mars", orbit: 113, size: 1.7, duration: 42, start: 80 },
  { name: "Jupiter", orbit: 122, size: 3.8, duration: 70, start: 200 },
  { name: "Saturn", orbit: 130, size: 2.8, duration: 100, start: 310 },
  { name: "Uranus", orbit: 138, size: 2.3, duration: 140, start: 110 },
  { name: "Neptune", orbit: 146, size: 2.3, duration: 190, start: 40 },
];

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function DiscCTA({
  href,
  title = "Let’s build something together",
}: Props) {
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<(SVGGElement | null)[]>([]);
  const busy = useRef(false);
  const speedTarget = useRef(1);

  // Un solo loop: rotación continua con velocidad suavizada
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const angles = PLANETS.map((p) => p.start);
    let speed = 1;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (visible) {
        speed += (speedTarget.current - speed) * Math.min(dt * 2.5, 1);
        PLANETS.forEach((p, i) => {
          angles[i] = (angles[i] + (360 / p.duration) * speed * dt) % 360;
          planetRefs.current[i]?.setAttribute(
            "transform",
            `rotate(${angles[i].toFixed(3)} 150 150)`,
          );
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        last = performance.now();
      },
      { threshold: 0 },
    );
    if (linkRef.current) io.observe(linkRef.current);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    const disc = discRef.current;
    if (busy.current || !disc) return;
    busy.current = true;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      router.push(href);
      return;
    }

    const rect = disc.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const r0 = rect.width / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const rOpen = Math.hypot(vw / 2, vh / 2) + 2;
    const k = rOpen / r0; // escala necesaria para cubrir la pantalla
    const dx = vw / 2 - cx;
    const dy = vh / 2 - cy;
    const color = getComputedStyle(disc).backgroundColor;

    // --- Clon del disco: es lo que viaja y crece ---
    const clone = disc.cloneNode(true) as HTMLDivElement;
    clone.classList.add("disc-clone");
    Object.assign(clone.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
      zIndex: "9999",
      pointerEvents: "all",
      transformOrigin: "50% 50%",
      willChange: "transform",
    });

    // Los planetas del clon siguen girando, más rápido
    clone.querySelectorAll<SVGGElement>(".disc-body").forEach((el, i) => {
      el.style.animation = `disc-spin ${PLANETS[i].duration / 8}s linear infinite`;
    });

    document.body.appendChild(clone);

    const DURATION = 1200;

    // El contenido se desvanece hacia la mitad del recorrido
    Array.from(clone.children).forEach((child) => {
      (child as HTMLElement).animate(
        [{ opacity: 1 }, { opacity: 1, offset: 0.45 }, { opacity: 0 }],
        { duration: DURATION, easing: "ease-in-out", fill: "forwards" },
      );
    });

    // 1) El disco viaja al centro de la pantalla mientras crece
    const zoom = clone.animate(
      [
        { transform: "translate3d(0,0,0) scale(1)" },
        { transform: `translate3d(${dx}px,${dy}px,0) scale(${k})` },
      ],
      {
        duration: DURATION,
        easing: "cubic-bezier(0.7, 0, 0.2, 1)",
        fill: "forwards",
      },
    );

    // 2) Se abre un hueco desde el centro que revela la página nueva
    const openHole = (cover: HTMLDivElement) => {
      const duration = 1100;
      const start = performance.now();

      const frame = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const r = easeInOut(t) * rOpen;
        const mask = `radial-gradient(circle at 50% 50%, transparent ${r}px, #000 ${r + 1}px)`;
        cover.style.maskImage = mask;
        cover.style.webkitMaskImage = mask;

        if (t < 1) requestAnimationFrame(frame);
        else cover.remove();
      };
      requestAnimationFrame(frame);
    };

    zoom.onfinish = () => {
      // Capa sólida del mismo color que el disco: el cambio es imperceptible
      const cover = document.createElement("div");
      Object.assign(cover.style, {
        position: "fixed",
        inset: "0",
        background: color,
        zIndex: "9999",
        pointerEvents: "all",
      });
      document.body.appendChild(cover);
      clone.remove();

      router.push(href);

      const started = Date.now();
      const timer = setInterval(() => {
        const arrived = window.location.pathname === href;
        if (arrived || Date.now() - started > 3000) {
          clearInterval(timer);
          setTimeout(() => openHole(cover), 250);
        }
      }, 50);
    };
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      onClick={handleClick}
      onPointerEnter={() => (speedTarget.current = 2.5)}
      onPointerLeave={() => (speedTarget.current = 1)}
      aria-label={title}
      className="group relative mx-auto block w-[min(88vw,540px)] rounded-full outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
    >
      <style>{`
        @keyframes disc-fade-in { from { opacity: 0; } }
        @keyframes disc-sun-breathe {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.06); }
        }
        @keyframes disc-spin { to { transform: rotate(360deg); } }

        .disc-orbit,
        .disc-body {
          transform-origin: 150px 150px;
          animation: disc-fade-in 1.4s ease-out both;
        }
        .disc-sun { animation: disc-sun-breathe 7s ease-in-out infinite; }

        .disc-clone .disc-orbit,
        .disc-clone .disc-sun { animation: none; }

        @media (prefers-reduced-motion: reduce) {
          .disc-orbit, .disc-body, .disc-sun { animation: none; }
        }
      `}</style>

      {/* Brillo exterior: solo cambia opacidad (barato y suave) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(128_128_128/0.22),transparent_68%)] opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
      />

      <div
        ref={discRef}
        className="relative isolate aspect-square w-full overflow-hidden rounded-full border border-slate-200/60 bg-slate-50 text-slate-900 transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:circle(50%)] group-hover:scale-[1.02] group-active:scale-[0.985] dark:border-slate-800/60 dark:bg-slate-900 dark:text-slate-100"
      >
        {/* Brillo suave central ("sol") */}
        <div
          aria-hidden="true"
          className="disc-sun pointer-events-none absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgb(128_128_128/0.16),transparent_70%)]"
        />

        {/* Sistema solar */}
        <svg
          viewBox="0 0 300 300"
          className="absolute inset-0 h-full w-full text-slate-400 transition-colors duration-700 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
          aria-hidden="true"
        >
          {PLANETS.map((p, i) => (
            <circle
              key={`o-${p.name}`}
              className="disc-orbit"
              style={{ animationDelay: `${i * 90}ms` }}
              cx="150"
              cy="150"
              r={p.orbit}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}

          {PLANETS.map((p, i) => (
            <g
              key={p.name}
              ref={(el) => {
                planetRefs.current[i] = el;
              }}
              transform={`rotate(${p.start} 150 150)`}
            >
              <g
                className="disc-body"
                style={{ animationDelay: `${400 + i * 90}ms` }}
              >
                <circle
                  cx="150"
                  cy={150 - p.orbit}
                  r={p.size}
                  fill="currentColor"
                  opacity="0.85"
                />
                {p.name === "Saturn" && (
                  <circle
                    cx="150"
                    cy={150 - p.orbit}
                    r={p.size * 1.9}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.6"
                  />
                )}
              </g>
            </g>
          ))}
        </svg>

        {/* Contenido central (siempre centrado, sin parallax) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[26%] text-center">
          <h2 className="mt-2 text-xl font-semibold leading-tight tracking-tight sm:mt-3 sm:text-3xl">
            {title}
          </h2>

          <span className="mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-900/25 text-slate-900 transition-[background-color,color,border-color] duration-700 ease-out group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white sm:mt-6 sm:h-12 sm:w-12 dark:border-slate-100/25 dark:text-slate-100 dark:group-hover:border-slate-100 dark:group-hover:bg-slate-100 dark:group-hover:text-slate-900">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-45 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
