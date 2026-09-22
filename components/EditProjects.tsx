"use client";

import { Project } from "@/lib/projects-db";
import { updateProject } from "@/app/actions/project";
import Link from "next/link";

interface EditProjectProps {
  project: Project;
}

export default function EditProject({ project }: EditProjectProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">
        Update Project
      </h3>

      <form action={updateProject.bind(null, project.id)} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={project.title}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            defaultValue={project.description}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={project.type}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="opensource">Open Source</option>
            <option value="school">School</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="technologies"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Technologies (comma separated)
          </label>
          <input
            type="text"
            id="technologies"
            name="technologies"
            required
            defaultValue={project.technologies.join(", ")}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
          />
        </div>

        <div>
          <label
            htmlFor="link"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Link (optional)
          </label>
          <input
            type="url"
            id="link"
            name="link"
            defaultValue={project.link || ""}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            Save Changes
          </button>

          <Link
            href="/projects"
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </Link>
        </div>
      </form>
    </article>
  );
}
