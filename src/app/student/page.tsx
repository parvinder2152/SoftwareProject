import { listPublicEvents, getUserRegistrations } from "@/lib/db";
import EventRegistrationForm from "@/components/event-registration-form";
import { cookies } from "next/headers";
import { deserializeSession, SESSION_COOKIE_NAME } from "@/lib/auth-session";

export const dynamic = 'force-dynamic';
export default async function StudentPage() {
  const events = await listPublicEvents();
  
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  const session = sessionCookie ? deserializeSession(sessionCookie.value) : null;
  const registeredEventIds = session ? await getUserRegistrations(session.id) : [];

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Student Dashboard</p>
        <h1 className="text-4xl font-semibold text-slate-900">Discover and join events</h1>
        <p className="max-w-2xl text-base text-slate-600">
          Browse published events and register directly with your student account.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <article key={event.id} className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  {event.statusLabel}
                </span>
                <span className="text-xs text-slate-500">{event.organizerName}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{event.title}</h2>
              <p className="mt-3 text-sm text-slate-600">{event.description}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>{event.eventDateLabel}</p>
                <p>{event.timeLabel}</p>
                <p>{event.location}</p>
              </div>
            </article>
          ))}
        </div>

        <EventRegistrationForm 
          events={events.filter((event) => event.status === "PUBLISHED")} 
          registeredEventIds={registeredEventIds} 
        />
      </div>
    </section>
  );
}
