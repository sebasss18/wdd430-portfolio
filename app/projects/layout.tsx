import Link from "next/link";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav className="flex gap-6 bg-blue-600 px-4 py-4 text-white">
        <Link href="/projects">Projects</Link>
        <Link href="/projects/settings">Settings</Link>
      </nav>

      {children}
    </section>
  );
}
