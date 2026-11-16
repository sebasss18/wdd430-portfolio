function SkeletonCard({ seed }: { seed: number }) {
  const w = [62, 78, 54, 86][seed % 4];
  return (
    <div className="flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-slate-300 bg-white p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
        <div className="flex h-6 items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-2.5 dark:border-slate-700 dark:bg-slate-900">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="ml-2 h-3 flex-1 rounded bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="flex flex-col gap-2 p-3">
          <div className="shimmer h-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div
            className="h-2 rounded bg-slate-200 dark:bg-slate-700"
            style={{ width: `${w}%` }}
          />
          <div className="h-2 w-full rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-2 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="shimmer h-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="shimmer h-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="shimmer h-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="shimmer h-8 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="flex gap-2">
            <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-2">
          <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-11/12 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-3/5 rounded bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-6 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-6 w-14 rounded-full bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading projects"
      className="grid gap-6 md:grid-cols-2"
    >
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} seed={i} />
      ))}
      <span className="sr-only">Loading projects…</span>
    </div>
  );
}
