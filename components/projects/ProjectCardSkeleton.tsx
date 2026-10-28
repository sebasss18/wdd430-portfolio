// Marcador visual de carga para una cuadrícula de tarjetas de proyectos.
export default function ProjectCardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 animate-pulse">
      <div className="h-56 rounded-2xl bg-slate-200" />
      <div className="h-56 rounded-2xl bg-slate-200" />
      <div className="h-56 rounded-2xl bg-slate-200" />
      <div className="h-56 rounded-2xl bg-slate-200" />
    </div>
  );
}
