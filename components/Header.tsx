import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white py-4 shadow-md transition-all duration-300 rounded-lg mx-3 mt-3">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <div
          id="header-title"
          className="text-2xl font-bold transition-all duration-300 hover:scale-105 hover:text-slate-300 active:scale-95"
        >
          Sebastian Bernal
        </div>
        <NavLinks />
      </div>
    </header>
  );
}
