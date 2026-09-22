export default function Loading() {
  return (
    <main className="container mx-auto min-h-screen px-4 py-12">
      <section className="mb-10 text-center animate-pulse">
        <div className="mx-auto mb-4 h-10 w-64 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="mx-auto h-6 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </section>

      <div className="animate-pulse">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <div className="h-10 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 w-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-10 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </main>
  );
}