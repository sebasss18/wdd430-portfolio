// Controles de paginación que conservan los filtros en los parámetros de ruta.
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function getPages(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "dots-end", total];
  if (current >= total - 3)
    return [1, "dots-start", total - 4, total - 3, total - 2, total - 1, total];
  return [
    1,
    "dots-start",
    current - 1,
    current,
    current + 1,
    "dots-end",
    total,
  ];
}

const base =
  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium tabular-nums active:scale-90 transition-transform duration-200";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Math.min(
    Math.max(Number(searchParams.get("page")) || 1, 1),
    totalPages,
  );

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = getPages(currentPage, totalPages);
  const slot = pages.indexOf(currentPage) + 1;

  const arrow = (dir: "prev" | "next") => {
    const target = dir === "prev" ? currentPage - 1 : currentPage + 1;
    const disabled =
      dir === "prev" ? currentPage <= 1 : currentPage >= totalPages;
    const label = dir === "prev" ? "Previous page" : "Next page";
    const icon = dir === "prev" ? "←" : "→";
    const nudge =
      dir === "prev" ? "hover:-translate-x-0.5" : "hover:translate-x-0.5";

    if (disabled) {
      return (
        <span
          aria-disabled="true"
          aria-label={label}
          className={`${base} cursor-not-allowed text-slate-300 dark:text-slate-600`}
        >
          {icon}
        </span>
      );
    }

    return (
      <Link
        href={createPageURL(target)}
        scroll={false}
        aria-label={label}
        className={`${base} ${nudge} text-slate-700 dark:text-slate-200`}
      >
        {icon}
      </Link>
    );
  };

  return (
    <nav aria-label="Pagination" className="mt-8 flex justify-center">
      <div className="relative flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
        <span
          aria-hidden="true"
          style={{ transform: `translateX(calc(${slot} * 2.75rem))` }}
          className="absolute left-1 top-1 h-10 w-10 rounded-full bg-slate-800 shadow-md transition-transform duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:bg-slate-600"
        />

        {arrow("prev")}

        {pages.map((page) =>
          typeof page === "string" ? (
            <span
              key={page}
              aria-hidden="true"
              className={`${base} text-slate-400 dark:text-slate-500`}
            >
              …
            </span>
          ) : (
            <Link
              key={page}
              href={createPageURL(page)}
              scroll={false}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={`${base} delay-100 ${
                page === currentPage
                  ? "text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              }`}
            >
              {page}
            </Link>
          ),
        )}

        {arrow("next")}
      </div>
    </nav>
  );
}
