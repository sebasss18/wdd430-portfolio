import ProjectList from "../../../components/ProjectList";
import { getProjects } from "../../../lib/projects-db";

export default async function Home() {
  const projects = await getProjects("opensource");

  return (
    <main className="container mx-auto min-h-screen px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h1 className="mb-10 text-3xl font-bold text-slate-900 dark:text-slate-100">
        OpenSource Projects
      </h1>

      {projects.length > 0 ? (
        <ProjectList projects={projects} />
      ) : (
        <p className="text-slate-500 dark:text-slate-400">
          No OpenSource projects found.
        </p>
      )}
    </main>
  );
}
