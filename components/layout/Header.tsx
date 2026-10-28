import Link from "next/link";
import NavLinks from "./NavLinks";
import FollowFace from "./FollowFace";

const PATH_A = "M325 193 H264 A82 82 0 0 0 264 357 H325";
const PATH_B = "M258 275 H321 A82 82 0 0 1 321 439 H258";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800/70">
      <div className="absolute inset-0 -z-10 bg-white/80 backdrop-blur-md dark:bg-slate-950/80" />
      <div className="relative mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <NavLinks />

        <div id="header-title" className="flex items-center gap-4">
          <Link
            href="/"
            aria-label="Home"
            className="group translate-x-2 text-slate-800 dark:text-white"
          >
            <svg
              viewBox="115 126 355 380"
              className="h-11 w-auto overflow-visible transition-transform duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:scale-110 group-active:scale-90"
              fill="none"
              stroke="currentColor"
              strokeWidth={54}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path
                d={PATH_A}
                className="transition-transform duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:-translate-x-3"
              />
              <path
                d={PATH_B}
                className="transition-transform duration-500 ease-[cubic-bezier(0.25,1.4,0.35,1)] group-hover:translate-x-3"
              />
            </svg>
          </Link>
          <FollowFace size={50} color="currentColor" />
        </div>
      </div>
    </header>
  );
}
