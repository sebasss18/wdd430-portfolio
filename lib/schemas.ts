import { z } from "zod";

export const ProjectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["opensource", "school"]),
  technologies: z
    .string()
    .min(1, "Technologies are required")
    .transform((value) =>
      value
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
    ),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
});
