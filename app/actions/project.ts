"use server";

import { neon } from "@neondatabase/serverless";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectFormSchema } from "@/lib/schemas";

const sql = neon(process.env.DATABASE_URL!);

export async function createProject(formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    technologies: formData.get("technologies"),
    link: formData.get("link"),
  };

  const validation = ProjectFormSchema.safeParse(data);

  if (!validation.success) {
    console.log(validation.error);
    return;
  }

  const { title, description, type, technologies, link } = validation.data;

  try {
    await sql`
      INSERT INTO projects (title, description, type, technologies, link)
      VALUES (${title}, ${description}, ${type}, ${technologies}, ${link || null})
    `;
  } catch (err) {
    console.error(err);
    return;
  }
  revalidatePath("/projects");
  redirect("/projects");
}

export async function updateProject(id: number, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    technologies: formData.get("technologies"),
    link: formData.get("link"),
  };

  const validation = ProjectFormSchema.safeParse(data);

  if (!validation.success) {
    console.log(validation.error);
    return;
  }

  const { title, description, type, technologies, link } = validation.data;

  try {
    await sql`
      UPDATE projects 
      SET title = ${title}, 
          description = ${description}, 
          type = ${type}, 
          technologies = ${technologies}, 
          link = ${link || null}
      WHERE id = ${id}
    `;
  } catch (err) {
    console.error(err);
    return;
  }

  revalidatePath("/projects");
  redirect("/projects");
}

export async function deleteProject(id: number) {
  try {
    await sql`
      DELETE FROM projects
      WHERE id = ${id}
    `;
  } catch (err) {
    return;
  }

  revalidatePath("/projects");
  redirect("/projects");
}
