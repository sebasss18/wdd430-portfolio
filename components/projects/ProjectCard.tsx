// Tarjeta que presenta un proyecto y sus tecnologías con enlaces opcionales.
import Link from "next/link";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

const circle =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all duration-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300";

export default function ProjectCard({
  id,
  title,
  description,
  technologies,
  link,
}: ProjectCardProps) {
  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:bg-white hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgb(128_128_128/0.3)_1px,transparent_1px)] bg-[size:22px_22px] opacity-0 transition-opacity duration-500 [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_65%)] group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          <Link
            href={`/projects/${id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:underline"
          >
            {title}
          </Link>
        </h3>

        <div className="flex items-center gap-2">
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${title} in a new tab`}
              title="Open project"
              className={`${circle} relative z-10 hover:scale-110 hover:border-slate-800 hover:bg-slate-800 hover:text-white active:scale-95 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900`}
            >
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
                <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
              </svg>
            </a>
          )}

          <span
            aria-hidden="true"
            className={`${circle} group-hover:-rotate-45 group-hover:border-slate-800 group-hover:bg-slate-800 group-hover:text-white dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-slate-900`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>

      <p className="mt-3 flex-1 text-slate-600 dark:text-slate-300">
        {description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
        {technologies.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
          >
            {tech}
          </li>
        ))}
      </ul>
    </article>
  );
}
