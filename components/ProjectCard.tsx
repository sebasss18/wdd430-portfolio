interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  link,
}: ProjectCardProps) {
  return (
    <article className="cursor-default rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-sm transition-all duration-300 hover:scale-101 hover:bg-white hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:shadow-xl">
      <h3 className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">
        {title}
      </h3>
      <p className="mb-3 text-slate-600 dark:text-slate-300">{description}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        <strong className="text-slate-700 dark:text-slate-200">
          Technologies:
        </strong>{" "}
        {technologies.join(", ")}
      </p>
      {link && (
        <p className="mt-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white"
          >
            View Project
          </a>
        </p>
      )}
    </article>
  );
}
