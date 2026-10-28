// Panel visual de acceso con saludo, estadísticas y carrusel de tecnologías.
"use client";

import { useEffect, useState } from "react";
import Reveal from "../effects/Reveal";
import Contador from "../home/NumberCounter";

const stack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Express",
  "MongoDB",
  "Prisma",
  "Render",
  "Git",
];

interface LoginAsideProps {
  projects: number;
  categories: number;
}

export default function LoginAside({ projects, categories }: LoginAsideProps) {
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const updateGreeting = () => {
      const h = new Date().getHours();

      setGreeting(
        h < 12 ? "Good morning" : h < 19 ? "Good afternoon" : "Good evening",
      );
    };

    const id = window.requestAnimationFrame(updateGreeting);

    return () => window.cancelAnimationFrame(id);
  }, []);

  const stats = [
    { value: projects, label: "Projects" },
    { value: categories, label: "Categories" },
    { value: stack.length, label: "Technologies" },
  ];

  return (
    <aside className="relative isolate hidden min-h-full flex-col justify-between gap-10 self-stretch overflow-hidden p-12 lg:flex">
      <style>{`
        @keyframes aside-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .aside-marquee {
            animation: none !important;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 border-r border-slate-200 bg-slate-50 [mask-image:linear-gradient(to_bottom,black_60%,transparent)] dark:border-slate-800 dark:bg-slate-900"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgb(128_128_128/0.3)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <div>
        <Reveal>
          <p className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-slate-800/40 motion-reduce:animate-none dark:bg-white/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-slate-800 dark:bg-white dark:shadow-[0_0_3px_1px_rgba(255,255,255,0.9),0_0_6px_2px_rgba(255,255,255,0.4)]" />
            </span>
            Private area
          </p>
        </Reveal>

        <Reveal retraso={100}>
          <h2 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-900 xl:text-6xl dark:text-white">
            Sebastian
            <br />
            Bernal
          </h2>
        </Reveal>

        <Reveal retraso={180}>
          <p className="mt-4 text-lg font-medium text-slate-500 dark:text-slate-400">
            Full Stack Developer
          </p>
        </Reveal>

        <Reveal retraso={240}>
          <p className="mt-6 text-slate-600 dark:text-slate-400">
            {greeting}. This is where I manage the projects on my site.
          </p>
        </Reveal>
      </div>

      <Reveal retraso={300}>
        <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-white py-6 text-center dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold tabular-nums tracking-tight">
                <Contador valor={stat.value} retraso={400} />
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <div
        aria-hidden="true"
        className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      >
        <div
          className="aside-marquee flex w-max gap-2 hover:[animation-play-state:paused]"
          style={{ animation: "aside-marquee 30s linear infinite" }}
        >
          {[...stack, ...stack].map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
