import ProjectList from "../../../components/ProjectList";
import { getProjects } from "../../../lib/projects-db";

export default async function Home() {
  const projects = await getProjects("school");

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10">School Projects</h1>

      {projects.length > 0 ? (
        <ProjectList projects={projects} />
      ) : (
        <p className="text-gray-500">No School projects found.</p>
      )}
    </main>
  );
}
