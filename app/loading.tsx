export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-12 animate-pulse">
      {/* Hero */}
      <section className="text-center py-12">
        <div className="mx-auto mb-4 h-10 w-64 rounded bg-gray-200" />

        <div className="mx-auto space-y-2 max-w-3xl">
          <div className="h-5 rounded bg-gray-200" />
          <div className="h-5 rounded bg-gray-200" />
          <div className="mx-auto h-5 w-2/3 rounded bg-gray-200" />
        </div>
      </section>

      {/* Projects */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="h-64 rounded-xl bg-gray-200" />
        <div className="h-64 rounded-xl bg-gray-200" />
      </section>

      {/* Buttons */}
      <div className="mt-10 space-y-4 text-center">
        <div className="mx-auto h-12 w-64 rounded-full bg-gray-200" />
        <div className="mx-auto h-12 w-64 rounded-full bg-gray-200" />
      </div>
    </main>
  );
}
