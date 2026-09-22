import ProjectList from "../components/ProjectList";
import { getProjects } from "../lib/projects-db";
import Link from "next/link";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="container mx-auto min-h-screen px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <section className="py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">
          My Portfolio
        </h1>

        <p className="text-lg text-slate-700 dark:text-slate-300">
          I’m Sebastian Bernal, a web full stack developer learning Next.js and
          React. I’ve built a variety of responsive and interactive web
          applications, and these are some of the projects I’ve worked on.
        </p>
      </section>

      <ProjectList projects={projects.slice(0, 2)} />

      <div className="mt-10 space-y-4 text-center">
        <div>
          <Link
            href="/projects"
            className="inline-block rounded-full border border-slate-300 bg-white px-20 py-3 font-bold text-slate-900 shadow-sm transition-all duration-300 hover:scale-104 hover:bg-slate-100 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            More Projects →
          </Link>
        </div>

        <div>
          <Link
            href="/contact"
            className="inline-block rounded-full border border-slate-800 bg-slate-800 px-20 py-3 font-bold text-white shadow-sm transition-all duration-300 hover:scale-104 hover:bg-slate-700 hover:shadow-lg dark:border-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </main>
  );
}
