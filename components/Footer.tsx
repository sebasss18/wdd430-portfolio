// Pie de página con navegación, enlaces sociales y control para volver arriba.
"use client";

import Link from "next/link";
import Reveal from "./Reveal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/sebasss18",
    icon: (
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    ),
    filled: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/tu-usuario",
    icon: (
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.83v1.57h.05c.53-1 1.84-2.07 3.78-2.07 4.04 0 4.79 2.66 4.79 6.12v5.88h-4v-5.21c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.3h-4V9.75Z" />
    ),
    filled: true,
  },
  {
    label: "Email",
    href: "sebasbernals11@gmail.com",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    filled: false,
  },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-12 overflow-hidden border-t border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(128_128_128/0.3)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />

      <Reveal>
        <div className="relative mx-auto max-w-5xl px-5 py-12 sm:px-4 sm:py-16">
          <div className="grid gap-10 text-center sm:grid-cols-3 sm:text-left">
            <div>
              <Link
                href="/"
                className="text-xl font-bold tracking-tight transition-opacity hover:opacity-70"
              >
                Sebastian Bernal
              </Link>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Full Stack Developer building with Next.js and React.
              </p>
            </div>

            <nav aria-label="Footer" className="sm:mx-auto">
              <p className="font-label text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                Navigate
              </p>
              <ul className="mt-3 space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="sm:ml-auto">
              <p className="font-label text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
                Connect
              </p>
              <div className="mt-3 flex justify-center gap-2 sm:justify-start">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-all duration-300 hover:scale-105 hover:border-slate-800 hover:bg-slate-800 hover:text-white active:scale-95 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill={s.filled ? "currentColor" : "none"}
                      stroke={s.filled ? "none" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {s.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:justify-between dark:border-slate-800 dark:text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Sebastian Bernal. All rights
              reserved.
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white py-1.5 pl-4 pr-1.5 font-medium text-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
            >
              Back to top
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white transition-transform duration-500 group-hover:scale-106 dark:bg-slate-700">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 19V5M6 11l6-6 6 6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
