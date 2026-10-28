// Botón de servidor que cierra la sesión y redirige a la página principal.
import { signOut } from "@/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="group inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition-all duration-300 hover:scale-105 hover:border-slate-800 hover:bg-slate-800 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900"
      >
        Sign out
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
      </button>
    </form>
  );
}
