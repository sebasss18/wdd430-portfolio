// Página de detalle que presenta un proyecto y enlaces de navegación relacionados.
import { cache } from "react";
import type { Metadata } from "next";
import { getProjectById, getProjects } from "@/lib/projects-db";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";

const getCachedProjectById = cache(getProjectById);

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    return {
      title: "Project Not Found",
      description: "The requested portfolio project could not be found.",
    };
  }

  const project = await getCachedProjectById(projectId);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested portfolio project could not be found.",
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
    },
  };
}

const eyebrow =
  "text-xs font-medium uppercase tracking-widest text-slate-500 sm:text-sm dark:text-slate-400";

const circle =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-500";

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    notFound();
  }

  const project = await getCachedProjectById(projectId);

  if (!project) notFound();

  const all = await getProjects();
  const index = all.findIndex((p) => p.id === project.id);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : null;

  return (
    <main className="min-h-screen overflow-x-hidden text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative px-5 py-10 sm:px-4 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgb(128_128_128/0.35)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]"
        />

        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white transition-all duration-300 group-hover:-translate-x-1 group-hover:border-slate-800 group-hover:bg-slate-800 group-hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-slate-900">
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
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
              </span>
              Back to projects
            </Link>
          </Reveal>

          <header className="mt-10 sm:mt-14">
            <Reveal retraso={80}>
              <span className="inline-block rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium capitalize tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                {project.type}
              </span>
            </Reveal>

            <Reveal retraso={160}>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                {project.title}
              </h1>
            </Reveal>
          </header>

          <Reveal retraso={240}>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:rounded-3xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
              <p className={eyebrow}>About</p>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
                {project.description}
              </p>
            </div>
          </Reveal>

          <section className="mt-10 sm:mt-14">
            <Reveal>
              <p className={eyebrow}>Stack</p>
              <h2 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                Built with
              </h2>
            </Reveal>

            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
              {project.technologies.map((tech, i) => (
                <li key={tech}>
                  <Reveal retraso={i * 60}>
                    <span className="block cursor-default rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-slate-800 hover:bg-slate-800 hover:text-white sm:px-4 sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900">
                      {tech}
                    </span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>

          {project.link && (
            <Reveal>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-slate-800 py-3 pl-8 pr-4 font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 sm:mt-14 dark:bg-slate-700"
              >
                Visit project
                <span
                  className={`${circle} bg-white text-slate-800 group-hover:-rotate-45`}
                >
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
              </a>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
}
