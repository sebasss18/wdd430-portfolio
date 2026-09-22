import Pagination from "@/components/Pagination";
import ProjectList from "@/components/ProjectList";
import {
  fetchFilteredProjects,
  fetchProjectsPages,
} from "../../lib/projects-db";

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

  return (
    <main className="container mx-auto min-h-screen px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="mb-10 text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
          My Projects
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-300">
          Here are some of the web development projects I have worked on,
          including school and open-source projects.
        </p>
      </section>

      <ProjectList projects={projects} />
      <Pagination totalPages={totalPages} />
    </main>
  );
}
