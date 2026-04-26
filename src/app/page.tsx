import { getDatabaseSnapshot } from "@/lib/db";
import DotAnimation from "@/components/dot-animation";

export const dynamic = 'force-dynamic';
export default async function Home() {
  const { featuredEvents } = await getDatabaseSnapshot();

  return (
    <section className="space-y-16">
      <DotAnimation />
      
      {/* Premium Translucent Hero Island */}
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl shadow-xl sm:px-8 sm:py-10">
        {/* Glassmorphic Background */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/20"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center px-4 py-10 text-center">
          <span className="inline-flex items-center rounded-full border border-cyan-600/30 bg-cyan-50/80 px-5 py-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-800 shadow-sm">
            Campus Event Hub
          </span>
          
          <h1 className="mt-6 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Coordinate events with{" "}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">
              clarity and speed.
            </span>
          </h1>
          
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base font-medium">
            CEH is powered by a robust Supabase backend, securely managing event creation, 
            student registrations, and platform authentication. Log in to access your customized dashboard.
          </p>
        </div>
      </div>

      {/* Upcoming Highlights - Modern Card Grid */}
      <div className="relative z-10 px-2 sm:px-6">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">At a glance</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Upcoming Highlights</h2>
          </div>
          <span className="text-sm font-semibold text-slate-600 bg-white/60 backdrop-blur-md border border-sky-100 rounded-full px-4 py-2 shadow-sm">
            Sign in to register
          </span>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredEvents.slice(0, 3).map((event) => (
            <div 
              key={event.id} 
              className="group relative overflow-hidden rounded-[32px] border border-white/50 bg-white/70 backdrop-blur-xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-900/5 hover:bg-white/90"
            >
              <div className="relative z-10">
                <span className="inline-flex rounded-full bg-cyan-100/80 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-800 ring-1 ring-inset ring-cyan-700/10">
                  {event.statusLabel}
                </span>
                
                <h3 className="mt-6 text-2xl font-bold leading-snug text-slate-900 group-hover:text-cyan-900 transition-colors">
                  {event.title}
                </h3>
                
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/50 text-slate-500 group-hover:bg-cyan-100/50 group-hover:text-cyan-600 transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    {event.eventDateLabel}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100/50 text-slate-500 group-hover:bg-cyan-100/50 group-hover:text-cyan-600 transition-colors">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
