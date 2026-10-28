// Distribuye una colección de proyectos en tarjetas reutilizables.
import ProjectCard from "./ProjectCard";
import type { Project } from "@/lib/projects-db";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          {...project}
          link={project.link ?? undefined}
        />
      ))}
    </section>
  );
}
