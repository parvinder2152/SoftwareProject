"use client";

import type { AuditLog } from "@/lib/db";

function formatAction(action: string) {
  switch (action) {
    case "user_created":
      return "Created account";
    case "event_created":
      return "Created event";
    case "event_updated":
      return "Updated event";
    case "event_deleted":
      return "Deleted event";
    case "user_registered":
      return "Registered for event";
    case "event_registration_created":
      return "Registered for event";
    default:
      return action;
  }
}

export default function AdminAuditLogs({ logs }: { logs: AuditLog[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">System Activity</h2>
      <p className="text-sm text-slate-600">Track all major actions performed on the platform.</p>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {logs.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No activity logs found.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {logs.map((log) => (
              <li key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {log.actorName} <span className="font-normal text-slate-500">{formatAction(log.action)}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        Target: {log.targetType}
                        {log.metadata?.title || log.metadata?.eventTitle ? ` (${log.metadata.title || log.metadata.eventTitle})` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{log.createdAtLabel}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
