// app/login/page.tsx
import { LoginForm } from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to manage projects in Sebastian Bernal's portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
