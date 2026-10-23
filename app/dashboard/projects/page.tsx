import Link from "next/link";
import { auth } from "@/auth";
import { getProjects } from "@/lib/projects-db";
import { SignOut } from "@/components/SignOut";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Dashboard",
  description: "Manage projects in Sebastian Bernal's portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardProjectsPage() {
  const session = await auth();
  const user = session?.user;
  const projects = await getProjects();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-slate-900 dark:text-slate-100">
      <header className="mb-10 flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Welcome back, {user?.name ?? "owner"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects/new"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-95 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            + New Project
          </Link>
          <SignOut />
        </div>
      </header>

      <section aria-labelledby="projects-heading">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="projects-heading" className="text-lg font-semibold">
            Projects
          </h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 px-6 py-14 text-center dark:border-slate-700">
            <p className="font-medium">No projects yet</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create your first project to show it in your portfolio.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="mt-5 inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              Create project
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {projects.map((project, i) => (
              <li
                key={project.id}
                className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span className="w-6 shrink-0 text-sm tabular-nums text-slate-400 dark:text-slate-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {project.type}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/dashboard/projects/${project.id}/edit`}
                  aria-label={`Edit ${project.title}`}
                  className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Edit
                  <span
                    aria-hidden="true"
                    className="ml-1 inline-block transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
