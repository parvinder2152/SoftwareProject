"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/student", label: "Student" },
  { href: "/organizer", label: "Organizer" },
  { href: "/admin", label: "Admin" },
];

type CurrentUser = {
  name: string;
  role: string;
  email: string;
};

export default function SiteNav() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const filteredNavItems = navItems.filter((item) => {
    if (!currentUser) {
      return false;
    }

    if (currentUser.role === "STUDENT") {
      return item.href === "/student";
    }

    if (currentUser.role === "ORGANIZER") {
      return item.href === "/organizer";
    }

    return item.href === "/admin";
  });

  useEffect(() => {
    function syncCurrentUser() {
      const storedUser = window.localStorage.getItem("uems-current-user");
      if (!storedUser) {
        setCurrentUser(null);
        return;
      }

      try {
        setCurrentUser(JSON.parse(storedUser) as CurrentUser);
      } catch {
        window.localStorage.removeItem("uems-current-user");
        setCurrentUser(null);
      }
    }

    syncCurrentUser();
    window.addEventListener("storage", syncCurrentUser);
    window.addEventListener("uems-auth-changed", syncCurrentUser);

    return () => {
      window.removeEventListener("storage", syncCurrentUser);
      window.removeEventListener("uems-auth-changed", syncCurrentUser);
    };
  }, []);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Client cleanup still runs even if network call fails.
    }

    window.localStorage.removeItem("uems-current-user");
    setCurrentUser(null);
    window.dispatchEvent(new Event("uems-auth-changed"));
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-sky-100 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
          CEH
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
            {filteredNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="hidden rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold text-cyan-800 sm:block">
                  {currentUser.name} · {currentUser.role}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void handleSignOut();
                  }}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-full border border-cyan-200 bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
