"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function EventCreateForm({ defaultName, defaultEmail }: { defaultName?: string; defaultEmail?: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    const payload = (await response.json()) as { error?: string; event?: { title: string } };

    if (!response.ok) {
      setError(payload.error ?? "Unable to save event.");
      return;
    }

    setMessage(`Created ${payload.event?.title ?? "the event"} in the Supabase database.`);
    event.currentTarget.reset();

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Organizer tools
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Create a new event</h2>
        <p className="text-sm text-slate-600">
          This writes directly to the Supabase database, so the new event appears immediately.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Organizer name
          <input
            type="text"
            name="organizerName"
            required
            defaultValue={defaultName}
            placeholder="Tech Club"
            className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Organizer email
          <input
            type="email"
            name="organizerEmail"
            required
            defaultValue={defaultEmail}
            placeholder="tech.club@uems.local"
            className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          type="text"
          name="title"
          required
          placeholder="Student Innovation Expo"
          className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Short summary for students and organizers."
          className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Location
          <input
            type="text"
            name="location"
            required
            placeholder="Student Center"
            className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Status
          <select
            name="status"
            className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
            defaultValue="PUBLISHED"
          >
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Event date
          <input
            type="date"
            name="eventDate"
            required
            className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Start time
          <input
            type="time"
            name="startTime"
            required
            className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          End time
          <input
            type="time"
            name="endTime"
            required
            className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
      >
        {pending ? "Saving..." : "Create event"}
      </button>

      {message ? <p className="text-sm font-medium text-cyan-700">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}
    </form>
  );
}
