// Cabecera fija del sitio que contiene la navegación principal.
import NavLinks from "./NavLinks";
import FollowFace from "./FollowFace";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800/70">
      <div className="absolute inset-0 -z-10 bg-white/80 backdrop-blur-md dark:bg-slate-950/80" />
      <div className="relative mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <NavLinks />

        <div
          id="header-title"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-2xl"
        >
          Sebastian Bernal
          <FollowFace size={50} color="currentColor" />
        </div>
      </div>
    </header>
  );
}
