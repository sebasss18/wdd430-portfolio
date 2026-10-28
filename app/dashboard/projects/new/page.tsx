// Página privada que permite añadir un proyecto al portafolio.
import Link from "next/link";
import CreateProject from "@/components/projects/CreateProject";
import Reveal from "@/components/effects/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Project",
  description: "Add a new project to Sebastian Bernal's portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewProjectPage() {
  return (
    <main className="min-h-screen overflow-x-hidden text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="relative px-5 py-10 sm:px-4 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgb(128_128_128/0.35)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]"
        />

        <div className="mx-auto max-w-2xl">
          <Reveal>
            <Link
              href="/dashboard/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white transition-all duration-300 group-hover:-translate-x-1 group-hover:border-slate-800 group-hover:bg-slate-800 group-hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-slate-900">
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
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
              </span>
              Back to dashboard
            </Link>
          </Reveal>

          <header className="mt-8">
            <Reveal retraso={80}>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500 sm:text-sm dark:text-slate-400">
                Dashboard
              </p>
            </Reveal>
            <Reveal retraso={160}>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
                Create project
              </h1>
            </Reveal>
          </header>

          <Reveal retraso={240}>
            <div className="mt-8">
              <CreateProject />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
