// Página principal que presenta el perfil, proyectos destacados y tecnologías.
import ProjectCarousel from "../components/ProjectCarousel";
import Reveal from "../components/Reveal";
import { getProjects } from "../lib/projects-db";
import Link from "next/link";
import type { Metadata } from "next";
import Contador from "../components/NumberCounter";
import RevealText from "../components/RevealText";
import DiscCTA from "../components/DiscCTA";
import Intro from "@/components/intro";
import HeroTitle from "@/components/HeroTitle";
import SoftText from "@/components/SoftText";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore my portfolio, discover the projects I’ve built, the technologies I work with, and learn more about me as a developer.",
};

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

export default async function Home() {
  const projects = await getProjects();
  const categories = new Set(projects.map((p) => p.type)).size;

  const stats = [
    { value: projects.length, label: "Projects" },
    { value: categories, label: "Categories" },
    { value: stack.length, label: "Technologies" },
  ];

  const eyebrow =
    "font-label text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400";
  return (
    <main className="min-h-screen overflow-x-hidden py-6 text-slate-900 sm:py-12 dark:bg-slate-950 dark:text-slate-100">
      <Intro />
      <section className="relative px-5 py-10 text-center sm:px-4 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgb(128_128_128/0.35)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)]"
        />

        <Reveal>
          <span className="text-big font-medium tracking-wide text-slate-500 dark:text-slate-400">
            Full Stack Developer
          </span>
        </Reveal>

        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:mt-6 sm:text-6xl">
          <HeroTitle />
        </h1>

        <SoftText
          className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:mt-6 sm:text-lg dark:text-slate-400"
          text="I build responsive, interactive web applications with Next.js and React. These are some of the projects I’ve worked on."
        />
      </section>

      <Reveal>
        <ProjectCarousel projects={projects} />
      </Reveal>

      <Reveal>
        <div className="mt-10 flex flex-col items-center gap-3 px-5 sm:mt-14 sm:flex-row sm:justify-center sm:px-4">
          <Link
            href="/projects"
            className="w-full max-w-sm rounded-full border border-slate-300 bg-white px-10 py-3 text-center font-bold text-slate-900 shadow-sm transition-all duration-300 hover:scale-103 hover:border-slate-900 hover:bg-slate-900 hover:text-white hover:shadow-lg active:scale-95 sm:w-auto sm:max-w-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900"
          >
            More Projects →
          </Link>

          <Link
            href="/contact"
            className="w-full max-w-sm max-w-sm rounded-full border border-slate-800 bg-slate-800 px-10 py-3 text-center font-bold text-white shadow-sm transition-all duration-300 hover:scale-102 hover:border-white hover:bg-white hover:text-slate-900 hover:shadow-lg active:scale-95 sm:w-auto sm:max-w-none dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:hover:border-slate-100 dark:hover:bg-slate-100 dark:hover:text-slate-900"
          >
            Contact Me
          </Link>
        </div>
      </Reveal>

      <Reveal>
        <section className="mx-auto mt-16 max-w-5xl px-5 sm:mt-28 sm:px-4">
          <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 py-6 text-center sm:rounded-3xl sm:py-8 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold tabular-nums tracking-tight sm:text-5xl">
                  <Contador valor={stat.value} retraso={200} />
                </p>
                <p className="mt-1.5 text-[10px] uppercase tracking-widest text-slate-500 sm:mt-2 sm:text-xs dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <section className="mx-auto mt-16 max-w-5xl px-5 text-center sm:mt-28 sm:px-4">
        <Reveal>
          <p className={eyebrow}>Stack</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Tools I work with
          </h2>
        </Reveal>

        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8">
          {stack.map((tech, i) => (
            <Reveal key={tech} retraso={i * 60}>
              <span className="block rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all duration-300 hover:scale-105 hover:border-slate-800 hover:bg-slate-800 hover:text-white sm:px-4 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900 cursor-default">
                {tech}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="mx-auto mt-16 max-w-5xl px-5 sm:mt-28 sm:px-4">
          <DiscCTA href="/contact" />
        </section>
      </Reveal>
    </main>
  );
}
