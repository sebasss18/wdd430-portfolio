import { Suspense } from "react";
import SchoolProjectList from "../../../components/SchoolProjectList";
import ProjectCardSkeleton from "@/components/ProjectCardSkeleton";

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h1 className="mb-10 text-3xl font-bold text-slate-900 dark:text-slate-100">
        School Projects
      </h1>

      <Suspense fallback={<ProjectCardSkeleton />}>
        <SchoolProjectList />
      </Suspense>
    </main>
  );
}
