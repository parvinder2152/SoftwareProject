import { getStats, listAllEvents, getAuditLogs } from "@/lib/db";
import AdminCreateOrganizerForm from "@/components/admin-create-organizer-form";
import AdminEventList from "@/components/admin-event-list";
import AdminAuditLogs from "@/components/admin-audit-logs";

export const dynamic = 'force-dynamic';
export default async function AdminPage() {
  const [stats, events, auditLogs] = await Promise.all([
    getStats(),
    listAllEvents(),
    getAuditLogs()
  ]);

  return (
    <section className="space-y-8 pb-12">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
          Admin Console
        </p>
        <h1 className="text-4xl font-semibold text-slate-900">Protect the platform</h1>
        <p className="max-w-2xl text-base text-slate-600">
          Moderation tools and system activity tracking.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-2xl font-semibold text-slate-900">{stats.totalUsers}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Users</p>
        </div>
        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-2xl font-semibold text-slate-900">{stats.totalEvents}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Events</p>
        </div>
        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-2xl font-semibold text-slate-900">{stats.totalRegistrations}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Registrations</p>
        </div>
        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
          <p className="text-2xl font-semibold text-slate-900">{stats.totalOrganizers}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Organizers</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <AdminEventList events={events} />
          <AdminAuditLogs logs={auditLogs} />
        </div>
        <div className="space-y-8">
          <AdminCreateOrganizerForm />
        </div>
      </div>
    </section>
  );
}
