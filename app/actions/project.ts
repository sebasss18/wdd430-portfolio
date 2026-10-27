// Acciones del servidor para autenticar y crear, actualizar o eliminar proyectos.
"use server";

import { neon } from "@neondatabase/serverless";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectFormSchema } from "@/lib/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const sql = neon(process.env.DATABASE_URL!);

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    type?: string[];
    technologies?: string[];
    link?: string[];
    liveUrl?: string[];
    yearCompleted?: string[];
  };
  message?: string | null;
};

async function requireOwnerSession() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  return session;
}

export async function createProject(
  prevState: State | undefined,
  formData: FormData,
): Promise<State> {
  await requireOwnerSession();
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    technologies: formData.get("technologies"),
    link: formData.get("link"),
    liveUrl: formData.get("liveUrl"),
    yearCompleted: formData.get("yearCompleted"),
  };

  const validation = ProjectFormSchema.safeParse(data);

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Please correct the errors below.",
    };
  }

  const {
    title,
    description,
    type,
    technologies,
    link,
    liveUrl,
    yearCompleted,
  } = validation.data;

  try {
    await sql`
      INSERT INTO projects (title, description, type, technologies, link, live_url, year_completed)
      VALUES (${title}, ${description}, ${type}, ${technologies}, ${link || null}, ${liveUrl || null}, ${yearCompleted})
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
  await requireOwnerSession();
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    technologies: formData.get("technologies"),
    link: formData.get("link"),
    liveUrl: formData.get("liveUrl"),
    yearCompleted: formData.get("yearCompleted"),
  };

  const validation = ProjectFormSchema.safeParse(data);

  if (!validation.success) {
    return {
      message: "Please correct the errors below.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const {
    title,
    description,
    type,
    technologies,
    link,
    liveUrl,
    yearCompleted,
  } = validation.data;

  try {
    await sql`
      UPDATE projects 
      SET title = ${title}, 
          description = ${description}, 
          type = ${type}, 
          technologies = ${technologies}, 
          link = ${link || null},
          live_url = ${liveUrl || null},
          year_completed = ${yearCompleted}
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
  await requireOwnerSession();
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

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard/projects",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
