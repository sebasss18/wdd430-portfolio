export default function Loading() {
  return (
    <main className="mx-auto max-w-4xl min-h-screen px-4 py-12">
      <div className="animate-pulse">
        <div className="mb-4 h-9 w-48 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-6 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-6 w-11/12 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-2 h-6 w-10/12 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
    </main>
  );
}