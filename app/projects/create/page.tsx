import CreateProject from "@/components/CreateProject";

export default function CreateProjectPage() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-800 dark:text-slate-100">
        Create Project
      </h1>
      <CreateProject />
    </div>
  );
}
