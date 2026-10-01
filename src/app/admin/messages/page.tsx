import Link from "next/link";
import { deleteMessage, updateMessageStatus } from "@/app/admin/messages/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const statusLabels = {
  UNREAD: "Unread",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
} as const;

const statusStyles = {
  UNREAD: "bg-amber-50 text-amber-800",
  READ: "bg-slate-100 text-slate-700",
  REPLIED: "bg-emerald-50 text-emerald-700",
  ARCHIVED: "bg-slate-100 text-slate-500",
} as const;

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const unreadCount = messages.filter((message) => message.status === "UNREAD").length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Inbox</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">Contact messages from visitors to your portfolio.</p>
        </div>
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{messages.length}</span> total
          <span className="mx-2 text-slate-300">/</span>
          <span className="font-semibold text-amber-700">{unreadCount}</span> unread
        </div>
      </header>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="font-semibold text-slate-800">Your inbox is empty</h2>
          <p className="mt-1 text-sm text-slate-500">New contact messages will appear here.</p>
        </div>
      ) : (
        <section aria-label="Contact messages" className="space-y-4">
          {messages.map((message) => {
            const statusAction = updateMessageStatus.bind(null, message.id);
            const deleteAction = deleteMessage.bind(null, message.id);
            const replySubject = message.subject ? `Re: ${message.subject}` : "Re: Your message";

            return (
              <article key={message.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-slate-900">{message.name}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[message.status]}`}>
                          {statusLabels[message.status]}
                        </span>
                      </div>
                      <a href={`mailto:${message.email}`} className="mt-1 block text-sm text-indigo-700 hover:text-indigo-900">{message.email}</a>
                      <p className="mt-1 text-xs text-slate-500">{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(message.createdAt)}</p>
                    </div>
                    <Link
                      href={`mailto:${message.email}?subject=${encodeURIComponent(replySubject)}`}
                      className="inline-flex w-fit items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      Reply by email
                    </Link>
                  </div>

                  {message.subject ? <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-slate-800">{message.subject}</p> : null}
                  <p className="mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-7 text-slate-700">{message.message}</p>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <form action={statusAction} className="flex flex-wrap items-center gap-2">
                    <label htmlFor={`status-${message.id}`} className="text-xs font-medium text-slate-600">Status</label>
                    <select id={`status-${message.id}`} name="status" defaultValue={message.status} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                      {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                    <button type="submit" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Save status</button>
                  </form>
                  <details>
                    <summary className="cursor-pointer list-none rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">Delete</summary>
                    <form action={deleteAction} className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                      <span className="text-sm text-rose-800">Delete this message permanently?</span>
                      <button type="submit" className="rounded-md bg-rose-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-800">Confirm delete</button>
                    </form>
                  </details>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}