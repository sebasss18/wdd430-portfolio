// Página de acceso con formulario y resumen del portafolio.
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import LoginAside from "@/components/LoginAside";
import Reveal from "@/components/Reveal";
import { getProjects } from "@/lib/projects-db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to manage projects in Sebastian Bernal's portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const projects = await getProjects();
  const categories = new Set(projects.map((p) => p.type)).size;

  return (
    <main className="grid min-h-screen overflow-x-hidden text-slate-900 lg:grid-cols-2 dark:bg-slate-950 dark:text-slate-100">
      <LoginAside projects={projects.length} categories={categories} />

      <section className="relative flex items-center justify-center px-5 py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgb(128_128_128/0.35)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)] lg:hidden"
        />

        <div className="w-full max-w-md">
          <Reveal>
            <Link
              href="/"
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
              Back to home
            </Link>
          </Reveal>

          <Reveal retraso={120}>
            <div className="mt-6">
              <LoginForm />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
