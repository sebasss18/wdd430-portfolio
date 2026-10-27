import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | null = null;

const ITEMS_PER_PAGE = 4;

function getSql() {
  if (!sql) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL is not configured. Add it to .env.local or your runtime environment before running Next.js.",
      );
    }
    sql = neon(databaseUrl);
  }
  return sql;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  type: "opensource" | "school";
  technologies: string[];
  link: string | null;
  liveUrl: string | null;
  image: string | null;
  yearCompleted: number | null;
}

export async function getProjects(type?: string | null): Promise<Project[]> {
  if (type) {
    const rows = (await getSql()`
      SELECT id, title, description, type, technologies, link,
        live_url AS "liveUrl", image, year_completed AS "yearCompleted"
      FROM projects
      WHERE type = ${type}
      ORDER BY id
    `) as Project[];
    return rows;
  }

  const rows = (await getSql()`
    SELECT id, title, description, type, technologies, link,
      live_url AS "liveUrl", image, year_completed AS "yearCompleted"
    FROM projects
    ORDER BY id
  `) as Project[];
  return rows;
}

export async function getProjectById(id: number): Promise<Project | null> {
  const rows = (await getSql()`
    SELECT id, title, description, type, technologies, link,
      live_url AS "liveUrl", image, year_completed AS "yearCompleted"
    FROM projects
    WHERE id = ${id}
  `) as Project[];

  return rows[0] ?? null;
}

export async function fetchFilteredProjects(
  query: string,
  page: number,
): Promise<Project[]> {
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const rows = (await getSql()`
    SELECT id, title, description, type, technologies, link,
      live_url AS "liveUrl", image, year_completed AS "yearCompleted"
    FROM projects
    WHERE
      title ILIKE ${`%${query}%`}
      OR description ILIKE ${`%${query}%`}
      OR type ILIKE ${`%${query}%`}
    ORDER BY id
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
  `) as Project[];

  return rows;
}

export async function fetchProjectsPages(query: string): Promise<number> {
  const rows = (await getSql()`
    SELECT COUNT(*) AS count
    FROM projects
    WHERE
      title ILIKE ${`%${query}%`}
      OR description ILIKE ${`%${query}%`}
      OR type ILIKE ${`%${query}%`}
  `) as Array<{ count: number }>;

  return Math.ceil(Number(rows[0]?.count ?? 0) / ITEMS_PER_PAGE);
}
