import ProjectList from "../../components/ProjectList";
import { getProjects } from "../../lib/projects-db";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-slate-800">My Projects</h1>

        <p className="text-lg text-slate-600">
          Here are some of the web development projects I have worked on,
          including school and open-source projects.
        </p>
      </section>

      <ProjectList projects={projects} />
    </main>
  );
}
