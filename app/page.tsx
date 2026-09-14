import ProjectList from "../components/ProjectList";
import ContactCard from "../components/ContactCard";

async function getProjects() {
  const res = await fetch("http://localhost:3000/api/projects");

  if (!res.ok) {
    throw new Error("Failed to fetch projects.");
  }

  return res.json();
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">My Portfolio</h1>
        <p className="text-lg text-gray-700">
          I’m Sebastian Bernal, a web full stack developer learning Next.js and
          React. I’ve built a variety of responsive and interactive web
          applications, and these are some of the projects I’ve worked on.
        </p>
      </section>

      <ProjectList projects={projects} />

      <ContactCard
        title="Contact Me"
        phoneNumber={6621415468}
        gmail="sebasbernals11@gmai.com"
      />
    </main>
  );
}
