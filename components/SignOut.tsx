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
        className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        Sign Out
      </button>
    </form>
  );
}
