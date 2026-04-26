"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PublicEvent, EventRegistration } from "@/lib/db";
import { fetchRegistrationsAction } from "@/app/organizer/actions";

type Props = {
  events: PublicEvent[];
};

type DraftEvent = {
  organizerName: string;
  organizerEmail: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: PublicEvent["status"];
};

function toDateInputValue(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function toTimeInputValue(value: string) {
  return new Date(value).toISOString().slice(11, 16);
}

function buildDraft(event: PublicEvent): DraftEvent {
  return {
    organizerName: event.organizerName,
    organizerEmail: event.organizerEmail,
    title: event.title,
    description: event.description,
    location: event.location,
    eventDate: toDateInputValue(event.eventDateIso),
    startTime: toTimeInputValue(event.startTimeIso),
    endTime: toTimeInputValue(event.endTimeIso),
    status: event.status,
  };
}

export default function EventManagementPanel({ events: initialEvents }: Props) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [draft, setDraft] = useState<DraftEvent | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  function beginEdit(event: PublicEvent) {
    setEditingId(event.id);
    setViewingId(null);
    setDraft(buildDraft(event));
    setMessage(null);
    setError(null);
  }

  async function toggleView(eventId: string) {
    if (viewingId === eventId) {
      setViewingId(null);
      return;
    }
    
    setViewingId(eventId);
    setEditingId(null);
    setRegistrations([]);
    setIsFetching(true);
    setError(null);
    
    const result = await fetchRegistrationsAction(eventId);
    setIsFetching(false);
    
    if (result.success) {
      setRegistrations(result.registrations);
    } else {
      setError(result.error ?? "Unable to load registrations.");
    }
  }

  async function saveEvent(eventId: string) {
    if (!draft) {
      return;
    }

    const response = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draft),
    });

    const payload = (await response.json()) as { error?: string; event?: PublicEvent };

    if (!response.ok) {
      setError(payload.error ?? "Unable to update event.");
      return;
    }

    setEvents((current) => current.map((item) => (item.id === eventId ? (payload.event ?? item) : item)));
    setEditingId(null);
    setDraft(null);
    setMessage(`Updated ${payload.event?.title ?? "the event"}.`);

    startTransition(() => {
      router.refresh();
    });
  }

  async function removeEvent(eventId: string) {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Unable to delete event.");
      return;
    }

    setEvents((current) => current.filter((item) => item.id !== eventId));
    if (editingId === eventId) {
      setEditingId(null);
      setDraft(null);
    }
    setMessage("Event deleted.");

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="space-y-4 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Live event queue
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Current submissions</h2>
      </div>

      {message ? <p className="text-sm font-medium text-cyan-700">{message}</p> : null}
      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      <div className="space-y-3">
        {events.map((event) => {
          const isEditing = editingId === event.id;

          return (
            <div key={event.id} className="rounded-2xl bg-sky-50/70 p-4">
              {isEditing && draft ? (
                <form
                  className="space-y-4"
                  onSubmit={(formEvent) => {
                    formEvent.preventDefault();
                    void saveEvent(event.id);
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-slate-900">Edit event</p>
                    <button
                      type="button"
                      className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                      onClick={() => {
                        setEditingId(null);
                        setDraft(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Organizer name
                      <input
                        value={draft.organizerName}
                        onChange={(changeEvent) => setDraft({ ...draft, organizerName: changeEvent.target.value })}
                        className="mt-2 w-full rounded-2xl border border-sky-100 px-3 py-2 text-sm focus:border-cyan-300 focus:outline-none"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Organizer email
                      <input
                        type="email"
                        value={draft.organizerEmail}
                        onChange={(changeEvent) => setDraft({ ...draft, organizerEmail: changeEvent.target.value })}
                        className="mt-2 w-full rounded-2xl border border-sky-100 px-3 py-2 text-sm focus:border-cyan-300 focus:outline-none"
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">
                    Title
                    <input
                      value={draft.title}
                      onChange={(changeEvent) => setDraft({ ...draft, title: changeEvent.target.value })}
                      className="mt-2 w-full rounded-2xl border border-sky-100 px-3 py-2 text-sm focus:border-cyan-300 focus:outline-none"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Description
                    <textarea
                      rows={3}
                      value={draft.description}
                      onChange={(changeEvent) => setDraft({ ...draft, description: changeEvent.target.value })}
                      className="mt-2 w-full rounded-2xl border border-sky-100 px-3 py-2 text-sm focus:border-cyan-300 focus:outline-none"
                    />
                  </label>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Location
                      <input
                        value={draft.location}
                        onChange={(changeEvent) => setDraft({ ...draft, location: changeEvent.target.value })}
                        className="mt-2 w-full rounded-2xl border border-sky-100 px-3 py-2 text-sm focus:border-cyan-300 focus:outline-none"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Status
                      <select
                        value={draft.status}
                        onChange={(changeEvent) => setDraft({ ...draft, status: changeEvent.target.value as PublicEvent["status"] })}
                        className="mt-2 w-full rounded-2xl border border-sky-100 px-3 py-2 text-sm focus:border-cyan-300 focus:outline-none"
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Event date
                      <input
                        type="date"
                        value={draft.eventDate}
                        onChange={(changeEvent) => setDraft({ ...draft, eventDate: changeEvent.target.value })}
                        className="mt-2 w-full rounded-2xl border border-sky-100 px-3 py-2 text-sm focus:border-cyan-300 focus:outline-none"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Start time
                      <input
                        type="time"
                        value={draft.startTime}
                        onChange={(changeEvent) => setDraft({ ...draft, startTime: changeEvent.target.value })}
                        className="mt-2 w-full rounded-2xl border border-sky-100 px-3 py-2 text-sm focus:border-cyan-300 focus:outline-none"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      End time
                      <input
                        type="time"
                        value={draft.endTime}
                        onChange={(changeEvent) => setDraft({ ...draft, endTime: changeEvent.target.value })}
                        className="mt-2 w-full rounded-2xl border border-sky-100 px-3 py-2 text-sm focus:border-cyan-300 focus:outline-none"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
                  >
                    {pending ? "Saving..." : "Save changes"}
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-slate-900">{event.title}</p>
                    <span className="text-xs uppercase tracking-[0.2em] text-cyan-700">
                      {event.statusLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {event.eventDateLabel} · {event.timeLabel}
                  </p>
                  <p className="text-sm text-slate-600">{event.location}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {event.organizerName}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => toggleView(event.id)}
                      className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700"
                    >
                      {viewingId === event.id ? "Close" : "Open"}
                    </button>
                    <button
                      type="button"
                      onClick={() => beginEdit(event)}
                      className="rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void removeEvent(event.id);
                      }}
                      className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                  
                  {viewingId === event.id && (
                    <div className="mt-6 border-t border-sky-100 pt-6">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
                        Event Details & Submissions
                      </h4>
                      <p className="text-sm text-slate-700 mb-6">{event.description}</p>
                      
                      {isFetching ? (
                        <p className="text-sm text-slate-500">Loading submissions...</p>
                      ) : registrations.length === 0 ? (
                        <p className="text-sm text-slate-500">No students have registered yet.</p>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-sky-100 bg-white">
                          <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-sky-50 text-xs uppercase text-slate-500">
                              <tr>
                                <th className="px-4 py-3 font-semibold">Student Name</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Registered On</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-sky-100">
                              {registrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 font-medium text-slate-900">{reg.userName}</td>
                                  <td className="px-4 py-3">{reg.userEmail}</td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                                      {reg.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-xs">{reg.createdAtLabel}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sky-200 bg-white p-4 text-sm text-slate-600">
            No events yet. Create one on the left.
          </div>
        ) : null}
      </div>
    </div>
  );
}
