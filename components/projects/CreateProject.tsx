"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createProject, State } from "@/app/actions/project";

const input =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/20 aria-[invalid=true]:border-red-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500 dark:focus:border-slate-300 dark:focus:ring-slate-300/20";

const label = "block text-sm font-medium text-slate-700 dark:text-slate-300";

const types = [
  { value: "opensource", label: "Open Source" },
  { value: "school", label: "School" },
];

function Errors({ name, errors }: { name: string; errors: string[] }) {
  return (
    <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
      {errors.map((error) => (
        <p
          key={error}
          className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16h.01" />
          </svg>
          {error}
        </p>
      ))}
    </div>
  );
}

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
  const [techs, setTechs] = useState("");

  const fieldErrors = (name: string): string[] =>
    (currentState.errors as Record<string, string[] | undefined> | undefined)?.[
      name
    ] ?? [];

  const techList = techs
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:rounded-3xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      {currentState.message && (
        <p
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {currentState.message}
        </p>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="title" className={label}>
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            aria-describedby="title-error"
            aria-invalid={fieldErrors("title").length > 0}
            className={`mt-1.5 ${input}`}
            placeholder="Project name"
          />
          <Errors name="title" errors={fieldErrors("title")} />
        </div>

        <div>
          <label htmlFor="description" className={label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            aria-describedby="description-error"
            aria-invalid={fieldErrors("description").length > 0}
            className={`mt-1.5 resize-y ${input}`}
            placeholder="Describe your project"
          />
          <Errors name="description" errors={fieldErrors("description")} />
        </div>

        <fieldset>
          <legend className={label}>Type</legend>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {types.map((t, i) => (
              <label key={t.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  required={i === 0}
                  className="peer sr-only"
                />
                <span className="block rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 peer-checked:border-slate-800 peer-checked:bg-slate-800 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-slate-800/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:peer-checked:border-white dark:peer-checked:bg-white dark:peer-checked:text-slate-900">
                  {t.label}
                </span>
              </label>
            ))}
          </div>
          <Errors name="type" errors={fieldErrors("type")} />
        </fieldset>

        <div>
          <label htmlFor="technologies" className={label}>
            Technologies{" "}
            <span className="font-normal text-slate-500 dark:text-slate-400">
              (comma separated)
            </span>
          </label>
          <input
            type="text"
            id="technologies"
            name="technologies"
            required
            value={techs}
            onChange={(e) => setTechs(e.target.value)}
            aria-describedby="technologies-error"
            aria-invalid={fieldErrors("technologies").length > 0}
            className={`mt-1.5 ${input}`}
            placeholder="React, Node.js, MongoDB"
          />
          <Errors name="technologies" errors={fieldErrors("technologies")} />

          {techList.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Preview">
              {techList.map((tech, i) => (
                <li
                  key={`${tech}-${i}`}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="link" className={label}>
              Link{" "}
              <span className="font-normal text-slate-500 dark:text-slate-400">
                (optional)
              </span>
            </label>
            <input
              type="url"
              id="link"
              name="link"
              aria-describedby="link-error"
              aria-invalid={fieldErrors("link").length > 0}
              className={`mt-1.5 ${input}`}
              placeholder="https://github.com/user/repo"
            />
            <Errors name="link" errors={fieldErrors("link")} />
          </div>

          <div>
            <label htmlFor="liveUrl" className={label}>
              Live site{" "}
              <span className="font-normal text-slate-500 dark:text-slate-400">
                (optional)
              </span>
            </label>
            <input
              type="url"
              id="liveUrl"
              name="liveUrl"
              aria-describedby="liveUrl-error"
              aria-invalid={fieldErrors("liveUrl").length > 0}
              className={`mt-1.5 ${input}`}
              placeholder="https://example.com"
            />
            <Errors name="liveUrl" errors={fieldErrors("liveUrl")} />
          </div>
        </div>

        <div>
          <label htmlFor="yearCompleted" className={label}>
            Year completed
          </label>
          <input
            id="yearCompleted"
            name="yearCompleted"
            type="number"
            inputMode="numeric"
            required
            aria-describedby="yearCompleted-error"
            aria-invalid={fieldErrors("yearCompleted").length > 0}
            className={`mt-1.5 ${input}`}
            placeholder={String(new Date().getFullYear())}
          />
          <Errors name="yearCompleted" errors={fieldErrors("yearCompleted")} />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <Link
            href="/dashboard/projects"
            className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-center text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-800 py-2.5 pl-7 pr-2.5 font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:bg-slate-700"
          >
            {isPending ? "Creating..." : "Create project"}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 transition-transform duration-500 group-enabled:group-hover:-rotate-45">
              {isPending ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 3a9 9 0 1 0 9 9" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </form>
    </article>
  );
}
