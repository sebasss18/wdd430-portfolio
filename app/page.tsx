import ProjectList from "../components/ProjectList";
import ContactCard from "../components/ContactCard";

const projects = [
  {
    title: "Space Explorer",
    description:
      "A web application for exploring space images and information using NASA and Wikipedia APIs.",
    technologies: ["HTML", "CSS", "JavaScript", "NASA API", "Wikipedia API"],
    link: "https://github.com/sebasss18/wdd330-space_explorer",
  },
  {
    title: "Taste of Mexico",
    description:
      "A responsive recipe website featuring Mexican food recipes and interactive web features.",
    technologies: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/sebasss18/wdd231",
  },
  {
    title: "Popcorn Picks",
    description:
      "A movie recommendation website that helps users discover movies based on their interests.",
    technologies: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/sebasss18/wdd131",
  },
  {
    title: "Sleep Outside",
    description:
      "A responsive e-commerce website for outdoor products developed as a team project.",
    technologies: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/sebasss18/wdd330-sleepoutside",
  },
];

export default function Home() {
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
