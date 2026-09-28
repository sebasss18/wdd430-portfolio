import { cache } from "react";
import type { Metadata } from "next";
import { getProjectById } from "@/lib/projects-db";
import Link from "next/link";
import { notFound } from "next/navigation";

const getCachedProjectById = cache(getProjectById);

type ProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    return {
      title: "Project Not Found",
      description: "The requested portfolio project could not be found.",
    };
  }

  const project = await getCachedProjectById(projectId);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested portfolio project could not be found.",
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
    },
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    notFound();
  }

  const project = await getCachedProjectById(projectId);

  if (!project) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12 text-slate-900 dark:text-slate-100">
      <Link
        href="/projects"
        className="mb-6 inline-block text-slate-600 hover:underline dark:text-slate-300"
      >
        ← Back to projects
      </Link>
      <article className="rounded-2xl border border-slate-200 bg-slate-100 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-sm capitalize text-slate-500 dark:text-slate-400">
          {project.type}
        </p>
        <h1 className="mb-4 text-3xl font-bold">{project.title}</h1>
        <p className="mb-6 whitespace-pre-line text-slate-700 dark:text-slate-300">
          {project.description}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <strong>Technologies:</strong> {project.technologies.join(", ")}
        </p>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            View Project
          </a>
        )}
      </article>
    </main>
  );
}
