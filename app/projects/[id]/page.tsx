import { cache } from "react";
import type { Metadata } from "next";
import { getProjectById } from "@/lib/projects-db";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/effects/Reveal";
import DotField from "@/components/effects/DotField";
import ProjectPreview from "@/components/projects/ProjectPreview";

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
  "font-label text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400";

const arrow = (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:-rotate-45 sm:h-8 sm:w-8"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function LinkRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 border-b border-slate-300 py-5 transition-colors hover:border-slate-800 focus-visible:outline-none focus-visible:border-slate-800 sm:py-7 dark:border-slate-800 dark:hover:border-slate-200 dark:focus-visible:border-slate-200"
    >
      <div className="min-w-0">
        <p className={eyebrow}>{label}</p>
        <p className="mt-1 truncate text-xl font-bold tracking-tighter transition-transform duration-500 ease-[cubic-bezier(0.25,1.12,0.35,1)] group-hover:translate-x-2 sm:text-3xl">
          {value}
        </p>
      </div>
      {arrow}
    </a>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    notFound();
  }

  const project = await getCachedProjectById(projectId);

  if (!project) notFound();

  const host = (project.liveUrl ?? project.link ?? "localhost:3000")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  return (
    <main className="min-h-dvh overflow-x-clip text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden px-5 pb-10 pt-28 sm:px-12 sm:pb-14 sm:pt-32">
        <DotField />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 transition-transform duration-300 group-hover:-translate-x-1 dark:border-slate-700">
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
              <p className={`${eyebrow} capitalize`}>
                {project.type}
                {project.yearCompleted ? ` · ${project.yearCompleted}` : ""}
              </p>
            </Reveal>
            <Reveal retraso={160}>
              <h1 className="mt-4 break-words text-5xl font-bold leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">
                {project.title}
              </h1>
            </Reveal>
          </header>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-12">
        <Reveal retraso={200}>
          <ProjectPreview
            src={project.liveUrl}
            image={project.image}
            title={project.title}
            host={host}
          />
        </Reveal>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5 sm:mt-20 sm:px-12">
        <Reveal>
          <p className={eyebrow}>About</p>
        </Reveal>
        <Reveal retraso={80}>
          <p className="mt-4 max-w-4xl whitespace-pre-line text-lg leading-relaxed text-slate-700 sm:text-2xl sm:leading-relaxed dark:text-slate-300">
            {project.description}
          </p>
        </Reveal>

        <Reveal retraso={120}>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 sm:px-4 sm:py-1.5 sm:text-sm dark:border-slate-700 dark:text-slate-300"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {(project.liveUrl || project.link) && (
        <section className="mx-auto mt-14 max-w-6xl px-5 pb-20 sm:mt-20 sm:px-12">
          <div className="border-t border-slate-300 dark:border-slate-800">
            {project.liveUrl && (
              <Reveal>
                <LinkRow
                  label="Live site"
                  value={host}
                  href={project.liveUrl}
                />
              </Reveal>
            )}
            {project.link && (
              <Reveal retraso={80}>
                <LinkRow
                  label="Repository"
                  value={project.link
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                  href={project.link}
                />
              </Reveal>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
