"use server";

import { neon } from "@neondatabase/serverless";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectFormSchema } from "@/lib/schemas";

const sql = neon(process.env.DATABASE_URL!);

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    type?: string[];
    technologies?: string[];
    link?: string[];
    yearCompleted?: string[];
  };
  message?: string | null;
};

export async function createProject(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    technologies: formData.get("technologies"),
    link: formData.get("link"),
    yearCompleted: formData.get("yearCompleted"),
  };

  const validation = ProjectFormSchema.safeParse(data);

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Please correct the errors below.",
    };
  }

  const { title, description, type, technologies, link, yearCompleted } =
    validation.data;

  try {
    await sql`
      INSERT INTO projects (title, description, type, technologies, link, year_completed)
      VALUES (${title}, ${description}, ${type}, ${technologies}, ${link || null}, ${yearCompleted})
    `;
  } catch {
    return {
      message: "Failed to create project. Please try again.",
      errors: {},
    };
  }
  revalidatePath("/projects");
  redirect("/projects");
}

export async function updateProject(
  id: number,
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    technologies: formData.get("technologies"),
    link: formData.get("link"),
    yearCompleted: formData.get("yearCompleted"),
  };

  const validation = ProjectFormSchema.safeParse(data);

  if (!validation.success) {
    return {
      message: "Please correct the errors below.",
      errors: validation.error.flatten().fieldErrors,
    };
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
  } catch {
    return {
      message: "Failed to update project. Please try again.",
      errors: {},
    };
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
  } catch {
    return;
  }

  revalidatePath("/projects");
  redirect("/projects");
}
