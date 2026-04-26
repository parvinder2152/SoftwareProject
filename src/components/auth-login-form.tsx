"use client";

import Link from "next/link";
import DotAnimation from "@/components/dot-animation";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AuthLoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    let response;
    try {
      const formData = new FormData(event.currentTarget);
      response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
    } catch {
      setError("Unable to reach the server. Please try again.");
      return;
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch {
      setError("Received an invalid response from the server.");
      return;
    }

    if (!response.ok) {
      setError(payload.error ?? "Unable to sign in.");
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("uems-current-user", JSON.stringify(payload.user));
      window.dispatchEvent(new Event("uems-auth-changed"));
    }

    setMessage(`Signed in as ${payload.user?.name ?? "user"} (${payload.user?.role ?? "STUDENT"}).`);
    window.location.href = payload.redirectTo ?? "/student";
  }

  return (
    <>
      <DotAnimation />
      <section className="relative z-10 mx-auto max-w-lg space-y-8 rounded-3xl border border-white/20 bg-white/5 p-8 shadow-xl backdrop-blur-md">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Welcome Back
        </p>
        <h1 className="text-3xl font-semibold text-slate-900">Sign in to CEH</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            required
            placeholder="you@university.edu"
            className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {message ? <p className="text-sm font-medium text-cyan-700">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      <p className="text-sm text-slate-700">
        New here?{" "}
        <Link href="/auth/register" className="font-semibold text-cyan-800 hover:text-cyan-900">
          Create an account
        </Link>
      </p>
    </section>
    </>
  );
}
