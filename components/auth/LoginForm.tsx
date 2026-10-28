// Formulario de inicio de sesión con estado de envío y mensajes de error.
"use client";

import { useActionState, useState } from "react";
import { authenticate } from "@/app/actions/project";

const input =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-800/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder-slate-500 dark:focus:border-slate-300 dark:focus:ring-slate-300/20";

const label =
  "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <article className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:rounded-3xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-7">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sign in to access your dashboard.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={input}
          />
        </div>

        <div>
          <label htmlFor="password" className={label}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              minLength={6}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`${input} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition-all duration-300 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A9.8 9.8 0 0 1 12 5c5 0 8.5 4 9.5 7a11.7 11.7 0 0 1-2.4 3.7M6.4 6.4A11.6 11.6 0 0 0 2.5 12c1 3 4.5 7 9.5 7a9.7 9.7 0 0 0 4.1-.9" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2.5 12C3.5 9 7 5 12 5s8.5 4 9.5 7c-1 3-4.5 7-9.5 7s-8.5-4-9.5-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            <svg
              viewBox="0 0 24 24"
              className="mt-0.5 h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            {errorMessage}
          </p>
        )}

        <button
          aria-disabled={isPending}
          disabled={isPending}
          type="submit"
          className="group flex h-12 w-full items-center justify-between rounded-full bg-slate-800 pl-7 pr-2 font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 dark:bg-slate-700"
        >
          {isPending ? "Signing in..." : "Sign in"}
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-800 transition-transform duration-500 group-enabled:group-hover:-rotate-45">
            {isPending ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 3a9 9 0 1 0 9 9" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </span>
        </button>
      </form>
    </article>
  );
}
