import type { Metadata } from "next";
import { getProjectById } from "@/lib/projects-db";
import EditProject from "@/components/EditProjects";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Project",
  description: "Edit a project in Sebastian Bernal's portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DashboardEditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(Number(id));

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-800 dark:text-slate-100">
        Edit Project
      </h1>
      <EditProject project={project} />
    </main>
  );
}
