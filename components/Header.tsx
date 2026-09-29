import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="py-4 text-white shadow-md transition-all duration-300">
      <div className="mr-[20px] relative mx-auto flex max-w-4xl items-center justify-between px-4">
        <NavLinks />

        <div
          id="header-title"
          className="text-2xl font-bold text-slate-800 dark:text-white"
        >
          Sebastian Bernal
        </div>
      </div>
    </header>
  );
}
