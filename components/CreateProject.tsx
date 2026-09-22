"use client";

import Link from "next/link";
import { createProject } from "@/app/actions/project";

export default function CreateProject() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">
        New Project
      </h3>

      <form action={createProject} className="space-y-4">
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
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            placeholder="Project name"
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
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            placeholder="Describe your project"
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
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Select a type</option>
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
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            placeholder="React, Node.js, MongoDB"
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
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            placeholder="https://example.com"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            Create Project
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
