import Pagination from "@/components/projects/Pagination";
import ProjectList from "@/components/projects/ProjectList";
import Reveal from "@/components/effects/Reveal";
import RevealText from "@/components/effects/RevealText";
import {
  fetchFilteredProjects,
  fetchProjectsPages,
} from "../../lib/projects-db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse Sebastian Bernal's web development portfolio, including school assignments and open-source projects.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.query ?? "";
  const page = Number(params.page ?? "1");

  const projects = await fetchFilteredProjects(query, page);
  const totalPages = await fetchProjectsPages(query);

  const current = String(Math.max(1, page)).padStart(2, "0");
  const total = String(Math.max(1, totalPages)).padStart(2, "0");

  return (
    <main className="min-h-dvh overflow-x-clip px-5 pb-20 pt-28 text-slate-900 sm:px-12 sm:pt-32 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-slate-300 pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12 dark:border-slate-800">
          <div>
            <Reveal>
              <span className="font-label text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400">
                Selected work
              </span>
            </Reveal>
            <Reveal retraso={80}>
              <h1 className="mt-3 text-5xl font-bold leading-none tracking-tighter sm:text-7xl">
                My <span className="text-outline">projects</span>
              </h1>
            </Reveal>
          </div>

          <RevealText className="max-w-sm text-base text-slate-600 sm:text-right sm:text-lg dark:text-slate-400">
            Web development projects I have worked on, including school and
            open-source projects.
          </RevealText>
        </header>

        <div className="flex items-center justify-between py-4">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400">
            {query ? `Results for “${query}”` : "All projects"}
          </span>
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-slate-500 sm:text-xs dark:text-slate-400">
            {current} / {total}
          </span>
        </div>

        <ProjectList projects={projects} />

        <div className="mt-12">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
