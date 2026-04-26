"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AdminCreateOrganizerForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/organizers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    const payload = (await response.json()) as { error?: string; user?: { name: string; email: string } };
    if (!response.ok) {
      setError(payload.error ?? "Unable to create organizer.");
      return;
    }

    setMessage(`Organizer account created: ${payload.user?.email ?? ""}`);
    event.currentTarget.reset();
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Admin action</p>
        <h2 className="text-2xl font-semibold text-slate-900">Create organizer account</h2>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Organizer name
        <input
          type="text"
          name="name"
          required
          className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          placeholder="Event Team Alpha"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Organizer email
        <input
          type="email"
          name="email"
          required
          className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          placeholder="team.alpha@iitrpr.ac.in"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          type="password"
          name="password"
          required
          className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          placeholder="123456"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
      >
        {pending ? "Creating..." : "Create organizer"}
      </button>

      {message ? <p className="text-sm font-medium text-cyan-700">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}
    </form>
  );
}
