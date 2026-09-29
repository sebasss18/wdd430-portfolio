"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex flex-col gap-1.5 md:hidden"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        <span
          className={`h-0.5 w-6 bg-slate-800 transition-all duration-300 dark:bg-white ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-800 transition-all duration-300 dark:bg-white ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-slate-800 transition-all duration-300 dark:bg-white ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      <ul
        className={`fixed inset-0 z-40 flex flex-col items-start gap-8 bg-white p-5 pt-20 text-left text-slate-800 transition-transform duration-500 ease-out dark:bg-slate-950 dark:text-white md:static md:z-auto md:flex-row md:items-center md:gap-6 md:bg-transparent md:p-0 md:pt-0 md:opacity-100 md:dark:bg-transparent ${
          isOpen
            ? "pointer-events-auto translate-y-0"
            : "pointer-events-none -translate-y-full md:pointer-events-auto md:translate-y-0"
        }`}
      >
        <li
          className={`max-md:transition-[transform,opacity,filter] max-md:delay-500 max-md:duration-500 max-md:ease-out ${
            isOpen
              ? "max-md:translate-x-0 max-md:opacity-100 max-md:blur-0"
              : "max-md:-translate-x-8 max-md:opacity-0 max-md:blur-sm"
          }`}
        >
          <Link
            href="/"
            className={pathname === "/" ? "font-bold" : ""}
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
        </li>

        <li
          className={`max-md:transition-[transform,opacity,filter] max-md:delay-[575ms] max-md:duration-500 max-md:ease-out ${
            isOpen
              ? "max-md:translate-x-0 max-md:opacity-100 max-md:blur-0"
              : "max-md:-translate-x-8 max-md:opacity-0 max-md:blur-sm"
          }`}
        >
          <Link
            href="/about"
            className={pathname === "/about" ? "font-bold" : ""}
            aria-current={pathname === "/about" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
        </li>

        <li
          className={`max-md:transition-[transform,opacity,filter] max-md:delay-[650ms] max-md:duration-500 max-md:ease-out ${
            isOpen
              ? "max-md:translate-x-0 max-md:opacity-100 max-md:blur-0"
              : "max-md:-translate-x-8 max-md:opacity-0 max-md:blur-sm"
          }`}
        >
          <Link
            href="/projects"
            className={pathname === "/projects" ? "font-bold" : ""}
            aria-current={pathname === "/projects" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
        </li>

        <li
          className={`max-md:transition-[transform,opacity,filter] max-md:delay-[725ms] max-md:duration-500 max-md:ease-out ${
            isOpen
              ? "max-md:translate-x-0 max-md:opacity-100 max-md:blur-0"
              : "max-md:-translate-x-8 max-md:opacity-0 max-md:blur-sm"
          }`}
        >
          <Link
            href="/contact"
            className={pathname === "/contact" ? "font-bold" : ""}
            aria-current={pathname === "/contact" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </li>

        <li
          className={`max-md:transition-[transform,opacity,filter] max-md:delay-[800ms] max-md:duration-500 max-md:ease-out ${
            isOpen
              ? "max-md:translate-x-0 max-md:opacity-100 max-md:blur-0"
              : "max-md:-translate-x-8 max-md:opacity-0 max-md:blur-sm"
          }`}
        >
          <Link
            href="/login"
            className={pathname === "/login" ? "font-bold" : ""}
            aria-current={pathname === "/login" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
        </li>
      </ul>
    </div>
  );
}
