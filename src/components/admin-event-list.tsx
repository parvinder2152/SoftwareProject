"use client";

import { useState, useTransition } from "react";
import type { PublicEvent } from "@/lib/db";
import { deactivateEventAction } from "@/app/admin/actions";

export default function AdminEventList({ events }: { events: PublicEvent[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDeactivate = (eventId: string) => {
    setPendingId(eventId);
    startTransition(async () => {
      await deactivateEventAction(eventId);
      setPendingId(null);
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Event Management</h2>
      <p className="text-sm text-slate-600">Review event submissions and deactivate inappropriate content.</p>

      <div className="grid gap-4">
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">No events found.</p>
        ) : null}

        {events.map((event) => {
          const isExpanded = expandedId === event.id;
          const isActive = event.status !== "CANCELLED";

          return (
            <div
              key={event.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      event.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : event.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {event.statusLabel}
                  </span>
                  <span className="font-medium text-slate-900">{event.title}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">{event.eventDateLabel}</span>
                  <span className="text-slate-400">
                    {isExpanded ? (
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50 p-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500">Description</h4>
                        <p className="mt-1 text-sm text-slate-900">{event.description}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500">Location</h4>
                        <p className="mt-1 text-sm text-slate-900">{event.location}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500">Organizer</h4>
                        <p className="mt-1 text-sm text-slate-900">{event.organizerName}</p>
                        <p className="text-sm text-slate-500">{event.organizerEmail}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500">Time</h4>
                        <p className="mt-1 text-sm text-slate-900">{event.timeLabel}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500">Registrations</h4>
                        <p className="mt-1 text-sm text-slate-900">{event.registrationCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    {isActive ? (
                      <button
                        onClick={() => handleDeactivate(event.id)}
                        disabled={isPending && pendingId === event.id}
                        className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                      >
                        {isPending && pendingId === event.id ? "Deactivating..." : "Deactivate Event"}
                      </button>
                    ) : (
                      <span className="text-sm italic text-slate-500">This event has been deactivated.</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
