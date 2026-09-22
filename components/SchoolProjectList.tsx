import ProjectList from "./ProjectList";
import { getProjects } from "../lib/projects-db";

export default async function SchoolProjectList() {
  const projects = await getProjects("school");

  return (
    <>
      {projects.length > 0 ? (
        <ProjectList projects={projects} />
      ) : (
        <p className="text-gray-500">No School projects found.</p>
      )}
    </>
  );
}
