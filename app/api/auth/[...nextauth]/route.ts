// Expone los métodos HTTP de autenticación proporcionados por NextAuth.
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
