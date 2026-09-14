export interface Project {
  id: number;
  title: string;
  description: string;
  type: "opensource" | "school";
  technologies: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Popcorn Picks",
    description:
      "A movie recommendation website that helps users discover movies using HTML, CSS, and JavaScript.",
    type: "school",
    technologies: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/sebasss18/wdd131",
  },

  {
    id: 2,
    title: "Space Explorer",
    description:
      "A space exploration website that uses NASA and Wikipedia APIs to discover planets, galaxies, stars, and other space information.",
    type: "school",
    technologies: ["HTML", "CSS", "JavaScript", "NASA API", "Wikipedia API"],
    link: "https://github.com/sebasss18/wdd330-space_explorer",
  },

  {
    id: 3,
    title: "Taste of Mexico",
    description:
      "A responsive recipe website featuring Mexican food recipes and interactive web features.",
    type: "school",
    technologies: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/sebasss18/wdd231",
  },

  {
    id: 4,
    title: "Sleep Outside",
    description:
      "A responsive e-commerce website for outdoor products developed as a team project.",
    type: "school",
    technologies: ["HTML", "CSS", "JavaScript"],
    link: "https://github.com/sebasss18/wdd330-sleepoutside",
  },
];

export function getProjects(type?: string | null): Project[] {
  if (type) return projects.filter((p) => p.type === type);
  return projects;
}

export function getProjectById(id: number): Project | null {
  return projects.find((p) => p.id === id) ?? null;
}
