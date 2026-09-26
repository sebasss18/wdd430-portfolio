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
  yearCompleted: z.coerce
    .number()
    .int("Year must be a whole number")
    .min(2000, "Year must be 2000 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});
