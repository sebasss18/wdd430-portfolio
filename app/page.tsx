import ProjectList from "../components/ProjectList";
import { getProjects } from "../lib/projects-db";
import Link from "next/link";

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">My Portfolio</h1>

        <p className="text-lg text-gray-700">
          I’m Sebastian Bernal, a web full stack developer learning Next.js and
          React. I’ve built a variety of responsive and interactive web
          applications, and these are some of the projects I’ve worked on.
        </p>
      </section>

      <ProjectList projects={projects.slice(0, 2)} />

      <div className="text-center mt-10 space-y-4">
        <div>
          <Link
            href="/projects"
            className="inline-block rounded-full border border-gray-300 bg-white px-20 py-3 font-bold text-gray-900 shadow-sm transition-all duration-300 hover:scale-104 hover:shadow-lg"
          >
            More Projects →
          </Link>
        </div>

        <div>
          <Link
            href="/contact"
            className="inline-block rounded-full border-slate-800 bg-slate-800 px-20 py-3 font-bold text-white shadow-sm transition-all duration-300 hover:scale-104 hover:shadow-lg"
          >
            Contact Me
          </Link>
        </div>
      </div>
    </main>
  );
}
