import ProjectCarousel from "@/components/ProjectCarousel";
import { getProjects } from "@/lib/projects-db";

const labels: Record<string, string> = {
  school: "School project",
  opensource: "Open source",
};

export default async function Featured() {
  const rows = await getProjects();

  const projects = rows.map((p) => ({
    id: p.id,
    title: p.title.trim(),
    type: labels[p.type] ?? p.type,
    preview: p.liveUrl ?? undefined,
    url: p.liveUrl ?? p.link ?? undefined,
    tags: p.technologies,
  }));

  return <ProjectCarousel projects={projects} />;
}
