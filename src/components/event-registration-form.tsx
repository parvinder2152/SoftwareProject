"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PublicEvent } from "@/lib/db";

type Props = {
  events: PublicEvent[];
  registeredEventIds?: string[];
};

export default function EventRegistrationForm({ events, registeredEventIds = [] }: Props) {
  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isAlreadyRegistered = registeredEventIds.includes(selectedEventId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const eventId = String(formData.get("eventId") ?? "");

    const response = await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const payload = (await response.json()) as { error?: string; user?: { name: string }; event?: { title: string } };

    if (!response.ok) {
      setError(payload.error ?? "Registration failed.");
      return;
    }

    setMessage(`${payload.user?.name ?? "You"} is registered for ${payload.event?.title ?? "the event"}.`);
    event.currentTarget.reset();

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Register for an event
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Reserve your place</h2>
      </div>

      <label className="block text-sm font-medium text-slate-700">
        Select event
        <select
          name="eventId"
          required
          className="mt-2 w-full rounded-2xl border border-sky-100 px-4 py-3 text-sm focus:border-cyan-300 focus:outline-none"
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          {events.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title} · {item.eventDateLabel} {registeredEventIds.includes(item.id) ? "(Registered)" : ""}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={pending || events.length === 0 || isAlreadyRegistered}
        className="w-full rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
      >
        {isAlreadyRegistered ? "Already Registered" : pending ? "Saving..." : "Register"}
      </button>

      {message ? <p className="text-sm font-medium text-cyan-700">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}
    </form>
  );
}
