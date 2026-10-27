// Panel privado para consultar, crear, editar y administrar los proyectos.
import Link from "next/link";
import { auth } from "@/auth";
import { getProjects } from "@/lib/projects-db";
import { SignOut } from "@/components/SignOut";
import Reveal from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Dashboard",
  description: "Manage projects in Sebastian Bernal's portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

const eyebrow =
  "font-label text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400";
export default async function DashboardProjectsPage() {
  const session = await auth();
  const user = session?.user;
  const projects = await getProjects();

  return (
    <main className="min-h-screen overflow-x-hidden text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative px-5 py-10 sm:px-4 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgb(128_128_128/0.35)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]"
        />

        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <Reveal>
                <p className={eyebrow}>Dashboard</p>
              </Reveal>
              <Reveal retraso={100}>
                <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Welcome back, {user?.name ?? "owner"}
                </h1>
              </Reveal>
            </div>

            <div className="shrink-0">
              <Reveal retraso={180}>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/dashboard/projects/new"
                    className="group inline-flex h-11 shrink-0 items-center gap-3 whitespace-nowrap rounded-full bg-slate-800 pl-6 pr-1.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 dark:bg-slate-700"
                  >
                    New project
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-800 transition-transform duration-500 group-hover:rotate-90">
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
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </Link>
                  <SignOut />
                </div>
              </Reveal>
            </div>
          </header>

          <section aria-labelledby="projects-heading" className="mt-12">
            <Reveal>
              <div className="mb-4 flex items-baseline justify-between">
                <h2
                  id="projects-heading"
                  className="text-xl font-bold tracking-tight"
                >
                  Projects
                </h2>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {projects.length}{" "}
                  {projects.length === 1 ? "project" : "projects"}
                </span>
              </div>
            </Reveal>

            {projects.length === 0 ? (
              <Reveal>
                <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center sm:rounded-3xl dark:border-slate-700">
                  <p className="font-bold">No projects yet</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Create your first project to show it in your portfolio.
                  </p>
                  <Link
                    href="/dashboard/projects/new"
                    className="mt-6 inline-block rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold shadow-sm transition-all duration-300 hover:scale-105 hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    Create project
                  </Link>
                </div>
              </Reveal>
            ) : (
              <ul className="space-y-3">
                {projects.map((project, i) => (
                  <li key={project.id}>
                    <Reveal retraso={Math.min(i, 6) * 60}>
                      <div className="group relative flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all duration-300 hover:scale-101 hover:border-slate-400 hover:bg-white hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800">
                        <div className="flex min-w-0 items-center gap-4">
                          <span className="w-6 shrink-0 text-sm tabular-nums text-slate-400 dark:text-slate-500">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold tracking-tight">
                              <Link
                                href={`/dashboard/projects/${project.id}/edit`}
                                aria-label={`Edit ${project.title}`}
                                className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:underline"
                              >
                                {project.title}
                              </Link>
                            </h3>
                            <span className="mt-1 inline-block rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-xs font-medium capitalize text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                              {project.type}
                            </span>
                          </div>
                        </div>

                        <span className="flex shrink-0 items-center gap-3">
                          <span className="hidden text-sm font-medium text-slate-500 transition-colors group-hover:text-slate-900 sm:inline dark:text-slate-400 dark:group-hover:text-white">
                            Edit
                          </span>
                          <span
                            aria-hidden="true"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all duration-500 group-hover:-rotate-45 group-hover:border-slate-800 group-hover:bg-slate-800 group-hover:text-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-slate-900"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </span>
                        </span>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
