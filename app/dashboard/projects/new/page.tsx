import CreateProject from "@/components/CreateProject";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Project",
  description: "Add a new project to Sebastian Bernal's portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-slate-800 dark:text-slate-100">
        Create Project
      </h1>
      <CreateProject />
    </main>
  );
}
