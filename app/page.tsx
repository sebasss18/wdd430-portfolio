import ProjectCarousel from "../components/ProjectCarousel";
import { getProjects } from "../lib/projects-db";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Explore Sebastian Bernal's portfolio of responsive web applications and full-stack development projects built while learning Next.js and React.",
};

const services = [
  {
    title: "Frontend",
    text: "Interfaces responsivas, animadas y accesibles con React y Tailwind.",
  },
  {
    title: "Backend",
    text: "APIs con Node.js y Express, autenticación y bases de datos.",
  },
  {
    title: "Deploy",
    text: "Aplicaciones publicadas y listas para usarse en producción.",
  },
];

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
    "text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400";

  return (
    <main className="min-h-screen overflow-x-hidden py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative px-4 py-16 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgb(148_163_184/0.35)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_72%)]"
        />

        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-base font-medium uppercase tracking-widest text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Full Stack Developer
        </span>

        <h1 className="mx-auto mt-6 max-w-2xl text-5xl font-bold tracking-tight sm:text-6xl">
          Hi, I’m Sebastian Bernal
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600 dark:text-slate-400">
          I build responsive, interactive web applications with Next.js and
          React. These are some of the projects I’ve worked on.
        </p>
      </section>

      <ProjectCarousel projects={projects} />

      <div className="mt-14 flex flex-col items-center gap-3 px-4 sm:flex-row sm:justify-center">
        <Link
          href="/projects"
          className="rounded-full border border-slate-300 bg-white px-10 py-3 font-bold text-slate-900 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-slate-100 hover:shadow-lg active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          More Projects →
        </Link>

        <Link
          href="/contact"
          className="rounded-full border border-slate-800 bg-slate-800 px-10 py-3 font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 hover:bg-slate-700 hover:shadow-lg active:scale-95 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          Contact Me
        </Link>
      </div>

      <section className="mx-auto mt-28 max-w-5xl px-4">
        <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-3xl border border-slate-200 bg-slate-50 py-8 text-center dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
                {String(stat.value).padStart(2, "0")}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-5xl px-4">
        <p className={eyebrow}>What I do</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          From interface to server
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-800 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-200 dark:hover:bg-slate-900"
            >
              <span className="text-sm tabular-nums text-slate-400 dark:text-slate-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-xl font-semibold tracking-tight">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {service.text}
              </p>
              <span className="mt-6 block h-0.5 w-8 rounded-full bg-slate-300 transition-all duration-700 group-hover:w-full group-hover:bg-slate-800 dark:bg-slate-700 dark:group-hover:bg-white" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-5xl px-4 text-center">
        <p className={eyebrow}>Stack</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Tools I work with
        </h2>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-slate-800 hover:bg-slate-800 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(148_163_184/0.3)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
          />
          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
            Let’s build something together
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-slate-600 dark:text-slate-400">
            Have an idea or a project in mind? I’d like to hear about it.
          </p>
          <Link
            href="/contact"
            className="group relative mt-8 inline-flex items-center gap-3 rounded-full bg-slate-800 py-3 pl-8 pr-4 font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 dark:bg-slate-700"
          >
            Get in touch
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 transition-transform duration-500 group-hover:-rotate-45">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
