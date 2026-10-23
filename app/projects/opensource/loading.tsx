// Esqueleto de carga para la lista de proyectos de código abierto.
export default function Loading() {
  return (
    <main
      className="container mx-auto min-h-screen px-4 py-12 dark:bg-slate-950"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading projects…</span>

      <div className="mb-10 h-9 w-64 animate-pulse rounded-lg bg-slate-200 sm:w-72 dark:bg-slate-800" />

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 120}ms` }}
            className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 motion-reduce:animate-none dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-36 bg-slate-200 sm:h-40 dark:bg-slate-800" />

            <div className="space-y-3 p-5">
              <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />

              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="flex gap-2 pt-1">
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-14 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
