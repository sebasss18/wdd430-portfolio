import Link from "next/link";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav className="flex gap-6 bg-slate-700 px-4 py-2 text-white mx-5 mb-3 rounded-b-xl">
        <Link
          href="/projects"
          className="transition-all duration-300 hover:text-slate-300 active:scale-95"
        >
          Projects
        </Link>

        <Link
          href="/projects/school"
          className="transition-all duration-300 hover:text-slate-300 active:scale-95"
        >
          School
        </Link>

        <Link
          href="/projects/opensource"
          className="transition-all duration-300 hover:text-slate-300 active:scale-95"
        >
          OpenSource
        </Link>
      </nav>

      {children}
    </section>
  );
}
