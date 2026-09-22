export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12">
      <div className="animate-pulse rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 h-9 w-48 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-6 w-11/12 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-6 w-10/12 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
    </main>
  );
}