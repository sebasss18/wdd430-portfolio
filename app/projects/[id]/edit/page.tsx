import { getProjectById } from "@/lib/projects-db";
import EditProject from "@/components/EditProjects";
import { notFound } from "next/navigation";

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const project = await getProjectById(Number(params.id));

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-800 dark:text-slate-100">
        Edit Project
      </h1>
      <EditProject project={project} />
    </div>
  );
}
