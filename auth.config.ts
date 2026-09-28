// auth.config.ts  (project root)
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Protect all routes under /dashboard
      const isProtected = nextUrl.pathname.startsWith("/dashboard");

      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // redirects to /login
      }

      // Redirect already-logged-in users away from the login page
      if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/dashboard/projects", nextUrl));
      }

      return true;
    },
  },
  providers: [], // providers are added in auth.ts
} satisfies NextAuthConfig;
