// Configuración de rutas protegidas y redirecciones para NextAuth.
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isProtected = nextUrl.pathname.startsWith("/dashboard");

      if (isProtected) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard/projects", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
