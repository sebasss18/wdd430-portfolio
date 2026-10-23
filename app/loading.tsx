export default function Loading() {
  const bone = "rounded-full bg-slate-200 dark:bg-slate-800";

  return (
    <main
      aria-busy="true"
      aria-label="Loading"
      className="min-h-screen animate-pulse overflow-x-hidden py-6 sm:py-12 dark:bg-slate-950"
    >
      <section className="px-5 py-10 text-center sm:px-4 sm:py-16">
        <div className={`mx-auto h-7 w-44 sm:h-9 sm:w-56 ${bone}`} />
        <div className="mx-auto mt-5 h-10 w-72 rounded-xl bg-slate-200 sm:mt-6 sm:h-16 sm:w-[32rem] dark:bg-slate-800" />
        <div className="mx-auto mt-4 max-w-xl space-y-2 sm:mt-6">
          <div className={`h-4 w-full sm:h-5 ${bone}`} />
          <div className={`mx-auto h-4 w-2/3 sm:h-5 ${bone}`} />
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-3xl items-center overflow-hidden">
          <div className="shrink-0 basis-[14%]" />
          <div className="shrink-0 basis-[72%] px-2 py-4">
            <div className="h-56 rounded-3xl border border-slate-200 bg-slate-100 p-8 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className={`h-4 w-14 ${bone}`} />
                <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="mt-16">
                <div className="h-8 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className={`mt-3 h-4 w-24 ${bone}`} />
                <div className={`mt-4 h-0.5 w-8 ${bone}`} />
              </div>
            </div>
          </div>
          <div className="shrink-0 basis-[14%]" />
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-12 ${bone}`} />
            <div className={`h-1.5 w-4 ${bone}`} />
            <div className={`h-1.5 w-4 ${bone}`} />
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </section>

      <div className="mt-10 flex flex-col items-center gap-3 px-5 sm:mt-14 sm:flex-row sm:justify-center sm:px-4">
        <div className={`h-12 w-full max-w-sm sm:w-48 ${bone}`} />
        <div className={`h-12 w-full max-w-sm sm:w-40 ${bone}`} />
      </div>

      <section className="mx-auto mt-16 max-w-5xl px-5 sm:mt-28 sm:px-4">
        <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 py-6 sm:rounded-3xl sm:py-8 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-9 w-14 rounded-lg bg-slate-200 sm:h-12 sm:w-20 dark:bg-slate-800" />
              <div className={`mt-2 h-2.5 w-14 sm:w-20 ${bone}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-5 text-center sm:mt-28 sm:px-4">
        <div className={`mx-auto h-3 w-14 ${bone}`} />
        <div className="mx-auto mt-3 h-8 w-56 rounded-lg bg-slate-200 sm:h-9 sm:w-72 dark:bg-slate-800" />
        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8">
          {[88, 64, 96, 104, 84, 76, 80, 68, 72, 48].map((w, i) => (
            <div
              key={i}
              style={{ width: w }}
              className="h-8 rounded-full bg-slate-200 sm:h-9 dark:bg-slate-800"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-5xl px-5 sm:mt-28 sm:px-4">
        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-12 sm:rounded-3xl sm:px-6 sm:py-16 dark:border-slate-800 dark:bg-slate-900">
          <div className="h-8 w-64 rounded-lg bg-slate-200 sm:h-10 sm:w-96 dark:bg-slate-800" />
          <div className={`mt-4 h-4 w-60 ${bone}`} />
          <div className={`mt-6 h-12 w-44 sm:mt-8 ${bone}`} />
        </div>
      </section>
    </main>
  );
}
