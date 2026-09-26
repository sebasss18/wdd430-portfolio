"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProject, State } from "@/app/actions/project";

export default function CreateProject() {
  const initialState: State = {
    message: null,
    errors: {},
  };

  const [state, formAction, isPending] = useActionState<State, FormData>(
    createProject,
    initialState,
  );
  const currentState = state ?? initialState;

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">
        New Project
      </h3>

      <form action={formAction} className="space-y-4">
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
            aria-describedby="title-error"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            placeholder="Project name"
          />
          {currentState.errors?.title &&
            currentState.errors.title.map((error) => (
              <div
                key={error}
                id="title-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {error}
              </div>
            ))}
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
            aria-describedby="description-error"
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            placeholder="Describe your project"
          />
          {currentState.errors?.description &&
            currentState.errors.description.map((error) => (
              <div
                key={error}
                id="description-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {error}
              </div>
            ))}
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
            aria-describedby="technologies-error"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
            placeholder="React, Node.js, MongoDB"
          />
          {currentState.errors?.technologies &&
            currentState.errors.technologies.map((error) => (
              <div
                key={error}
                id="technologies-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {error}
              </div>
            ))}
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
        <div>
          <label
            htmlFor="yearCompleted"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Year Completed
          </label>

          <input
            id="yearCompleted"
            name="yearCompleted"
            type="number"
            required
            aria-describedby="yearCompleted-error"
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />

          {currentState.errors?.yearCompleted &&
            currentState.errors.yearCompleted.map((error) => (
              <div
                key={error}
                id="yearCompleted-error"
                aria-live="polite"
                aria-atomic="true"
              >
                {error}
              </div>
            ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            {isPending ? "Creating..." : "Create Project"}
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
