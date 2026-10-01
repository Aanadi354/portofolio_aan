"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";

const navigation = [
  { label: "Dashboard", href: "/admin", slug: "dashboard" },
  { label: "Profile", href: "/admin?view=profile", slug: "profile" },
  { label: "Education", href: "/admin?view=education", slug: "education" },
  { label: "Career", href: "/admin?view=career", slug: "career" },
  { label: "Skills", href: "/admin?view=skills", slug: "skills" },
  { label: "Projects", href: "/admin?view=projects", slug: "projects" },
  { label: "Social Links", href: "/admin?view=social-links", slug: "social-links" },
  { label: "Messages", href: "/admin?view=messages", slug: "messages" },
  { label: "Settings", href: "/admin?view=settings", slug: "settings" },
];

export function AdminShell({
  children,
  userName,
  userEmail,
}: {
  children: ReactNode;
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentView = searchParams.get("view") ?? "dashboard";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={[
            "fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-slate-950 text-slate-100 transition-transform duration-200 md:static md:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          ].join(" ")}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-6 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Portfolio
                </p>
                <h1 className="mt-2 text-xl font-bold text-white">CMS Panel</h1>
              </div>
            </div>

            <nav className="flex-1 space-y-2 px-4 pb-6">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href.split("?")[0] &&
                  (item.slug === "dashboard"
                    ? currentView === "dashboard"
                    : currentView === item.slug);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={[
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                    <span className="h-2 w-2 rounded-full bg-current/70" />
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-800 p-4">
              <div className="rounded-xl bg-slate-900/60 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in</p>
                <p className="mt-2 text-sm font-semibold text-white">{userName}</p>
                <p className="text-xs text-slate-400">{userEmail}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen((value) => !value)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
                  aria-label="Toggle sidebar"
                >
                  ☰
                </button>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Overview
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right sm:block">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">User</p>
                  <p className="text-sm font-semibold text-slate-800">{userName}</p>
                </div>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
