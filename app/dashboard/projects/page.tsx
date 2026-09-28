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
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Welcome back, {user?.name ?? "owner"}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects/new"
            className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            New Project
          </Link>
          <SignOut />
        </div>
      </div>

      <section className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800"
          >
            <div>
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {project.type}
              </p>
            </div>

            <Link
              href={`/dashboard/projects/${project.id}/edit`}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Edit
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}
