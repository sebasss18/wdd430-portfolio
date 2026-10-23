"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/projects", label: "Projects" },
  { href: "/projects/school", label: "School" },
  { href: "/projects/opensource", label: "OpenSource" },
];

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const found = tabs.findIndex(
    (tab) => tab.href !== "/projects" && pathname.startsWith(tab.href),
  );
  const activeIndex = found === -1 ? 0 : found;

  return (
    <section>
      <nav
        aria-label="Projects sections"
        className="relative mx-5 mb-3 mt-5 grid max-w-md grid-cols-3 rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800"
      >
        <span
          aria-hidden="true"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
          className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-slate-800 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-slate-600"
        />

        {tabs.map((tab, i) => {
          const active = i === activeIndex;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`relative z-10 rounded-full py-1.5 text-center text-sm font-medium transition-colors duration-300 active:scale-95 ${
                active
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </section>
  );
}
