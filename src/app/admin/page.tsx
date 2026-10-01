export const dynamic = "force-dynamic";

const stats = [
  { label: "Profile", value: "Ready", tone: "indigo" },
  { label: "Projects", value: "12", tone: "emerald" },
  { label: "Messages", value: "4", tone: "amber" },
  { label: "Skills", value: "28", tone: "sky" },
];

const quickActions = [
  "Update profile",
  "Add project",
  "Review messages",
  "Manage settings",
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-white shadow-xl shadow-slate-200/80 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              Admin Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, Administrator
            </h1>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Status</p>
            <p className="mt-1 text-lg font-semibold text-emerald-300">Online</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{item.label}</p>
              <span
                className={[
                  "inline-flex h-2.5 w-2.5 rounded-full",
                  item.tone === "indigo" && "bg-indigo-500",
                  item.tone === "emerald" && "bg-emerald-500",
                  item.tone === "amber" && "bg-amber-500",
                  item.tone === "sky" && "bg-sky-500",
                ].join(" ")}
              />
            </div>
            <p className="mt-5 text-3xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              This week
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { title: "Profile updated", meta: "2 hours ago", tone: "indigo" },
              { title: "New project published", meta: "Yesterday", tone: "emerald" },
              { title: "3 new messages received", meta: "3 days ago", tone: "amber" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                <span
                  className={[
                    "mt-1 h-2.5 w-2.5 rounded-full",
                    item.tone === "indigo" && "bg-indigo-500",
                    item.tone === "emerald" && "bg-emerald-500",
                    item.tone === "amber" && "bg-amber-500",
                  ].join(" ")}
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>

          <div className="mt-5 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <span>{action}</span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
