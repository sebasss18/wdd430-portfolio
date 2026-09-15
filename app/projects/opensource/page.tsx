import ProjectList from "../../../components/ProjectList";
import { getProjects } from "../../../lib/projects-db";

export default async function Home() {
  const projects = await getProjects("opensource");

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10">OpenSource Projects</h1>

      {projects.length > 0 ? (
        <ProjectList projects={projects} />
      ) : (
        <p className="text-gray-500">No OpenSource projects found.</p>
      )}
    </main>
  );
}
