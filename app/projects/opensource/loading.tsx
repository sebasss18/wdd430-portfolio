export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-12 animate-pulse">
      <div className="mb-10 h-9 w-72 rounded bg-slate-200" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-56 rounded-2xl bg-slate-200" />
        <div className="h-56 rounded-2xl bg-slate-200" />
        <div className="h-56 rounded-2xl bg-slate-200" />
        <div className="h-56 rounded-2xl bg-slate-200" />
      </div>
    </main>
  );
}
