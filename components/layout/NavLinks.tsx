"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const links: { href: string; label: string; cta?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Dashboard", cta: true },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const current =
    hovered ?? links.find((l) => !l.cta && isActive(l.href))?.href ?? null;

  useEffect(() => {
    if (!isOpen) return;
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlockTimer.current = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }, 950);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    const t = setTimeout(() => setEntered(false), 1000);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setIsOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const bar =
    "absolute h-0.5 rounded-full bg-slate-800 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-white";
  return (
    <nav aria-label="Main navigation">
      <button
        type="button"
        onClick={() => {
          if (!isOpen) setEntered(true);
          setIsOpen((v) => !v);
        }}
        className="group relative z-50 h-8 w-8 appearance-none border-0 bg-transparent p-0 shadow-none outline-none ring-0 [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline-none md:hidden"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        aria-controls="main-menu"
        data-face-sleep
      >
        <span
          className={`${bar} ${
            isOpen
              ? "right-1 top-[15px] w-6 rotate-45"
              : "right-0 top-[11px] w-8 group-hover:w-5"
          }`}
        />
        <span
          className={`${bar} ${
            isOpen
              ? "right-1 top-[15px] w-6 -rotate-45"
              : "right-0 top-[19px] w-5 group-hover:w-8"
          }`}
        />
      </button>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 md:hidden"
      >
        <div
          style={{ transitionDelay: isOpen ? "0ms" : "270ms" }}
          className={`absolute inset-0 origin-left bg-slate-200 transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] dark:bg-slate-800 ${
            isOpen ? "scale-x-100" : "scale-x-0"
          }`}
        />
        <div
          style={{ transitionDelay: isOpen ? "120ms" : "150ms" }}
          className={`absolute inset-0 origin-left bg-white transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] dark:bg-slate-950 ${
            isOpen ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>

      <ul
        id="main-menu"
        onPointerLeave={() => setHovered(null)}
        style={{ transitionDelay: isOpen ? "0ms" : "1000ms" }}
        className={`fixed inset-0 z-40 flex flex-col items-start justify-center gap-7 px-8 text-slate-800 transition-[visibility] duration-0 dark:text-white md:visible md:static md:z-auto md:w-fit md:flex-row md:items-center md:justify-start md:gap-1 md:rounded-full md:border md:border-slate-200 md:bg-slate-50 md:p-1 dark:md:border-slate-800 dark:md:bg-slate-900 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {links.map((link, i) => {
          const active = isActive(link.href);
          return (
            <li
              key={link.href}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                setHovered(link.cta ? null : link.href);
              }}
              style={{
                transition: isOpen
                  ? `transform 700ms cubic-bezier(0.22,1,0.36,1) ${380 + i * 80}ms, opacity 700ms cubic-bezier(0.22,1,0.36,1) ${380 + i * 80}ms`
                  : `opacity 250ms ease-out ${(links.length - 1 - i) * 30}ms`,
              }}
              className={`md:relative ${
                entered
                  ? "max-md:[transform:translateX(0)]"
                  : "max-md:[transform:translateX(-40px)]"
              } ${isOpen ? "max-md:opacity-100" : "max-md:opacity-0"}`}
            >
              {current === link.href && (
                <motion.span
                  layoutId="nav-pill"
                  aria-hidden="true"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className="absolute inset-0 hidden rounded-full bg-white shadow-sm md:block dark:bg-slate-700/70 dark:shadow-none"
                />
              )}
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={`group relative inline-block text-4xl transition-all duration-300 ease-out hover:translate-x-2 active:scale-95 md:rounded-full md:px-4 md:py-1.5 md:text-sm md:hover:translate-x-0 ${
                  link.cta
                    ? "md:isolate md:ml-1 md:inline-flex md:items-center md:justify-center md:gap-1.5 md:overflow-hidden md:bg-slate-900 md:text-white md:opacity-100 md:duration-500 md:hover:text-slate-900 dark:md:bg-white dark:md:text-slate-900 dark:md:hover:text-white"
                    : ""
                } ${
                  active
                    ? "font-bold max-md:[text-shadow:0_0_14px_rgba(0,0,0,0.35)] dark:max-md:[text-shadow:0_0_14px_rgba(255,255,255,0.65),0_0_28px_rgba(255,255,255,0.3)]"
                    : "font-medium opacity-60 hover:opacity-100"
                }`}
              >
                {link.cta && (
                  <>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 hidden bg-slate-50 transition-[clip-path] duration-1500 ease-[cubic-bezier(0.22,1,0.36,1)] [clip-path:circle(0%_at_0%_50%)] group-hover:[clip-path:circle(170%_at_0%_50%)] md:block dark:bg-slate-900"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 hidden rounded-full opacity-0 ring-1 ring-inset ring-slate-900 transition-opacity duration-500 group-hover:opacity-100 md:block dark:ring-white"
                    />
                  </>
                )}
                {link.label}
                {link.cta && (
                  <svg
                    viewBox="0 0 24 24"
                    className="hidden h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:block"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
