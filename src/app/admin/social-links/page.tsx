import { deleteSocialLink } from "@/app/admin/social-links/actions";
import { SocialLinkForm } from "@/components/admin/social-link-form";
import { prisma } from "@/lib/prisma";
import type { SocialLinkFormValues } from "@/types/social-link";

export const dynamic = "force-dynamic";

export default async function AdminSocialLinksPage() {
  const records = await prisma.socialLink.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  const socialLinks: SocialLinkFormValues[] = records.map((link) => ({
    id: link.id,
    platform: link.platform,
    label: link.label,
    url: link.url,
    icon: link.icon ?? "",
    order: link.order,
    isActive: link.isActive,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Public content</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Social Links</h1>
        <p className="mt-1 text-sm text-slate-500">Manage the external profiles displayed on your portfolio.</p>
      </header>

      <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:px-7">
          <span>
            <span className="block font-semibold text-slate-900">Add social link</span>
            <span className="mt-1 block text-sm text-slate-500">Add a profile visitors can find you on.</span>
          </span>
          <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-500 transition group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-slate-100 p-5 sm:p-7"><SocialLinkForm /></div>
      </details>

      <section aria-label="Social links" className="space-y-4">
        {socialLinks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="font-semibold text-slate-800">No social links yet</h2>
            <p className="mt-1 text-sm text-slate-500">Add a link to make it available on your portfolio.</p>
          </div>
        ) : socialLinks.map((link) => {
          const deleteAction = deleteSocialLink.bind(null, link.id);

          return (
            <article key={link.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-900">{link.platform}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${link.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {link.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{link.label}</p>
                  <a href={link.url} target="_blank" rel="noreferrer" className="mt-1 block truncate text-sm text-indigo-700 hover:text-indigo-900">{link.url}</a>
                </div>
                <div className="flex flex-wrap gap-2">
                  <details>
                    <summary className="cursor-pointer list-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Edit</summary>
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                      <SocialLinkForm link={link} />
                    </div>
                  </details>
                  <details>
                    <summary className="cursor-pointer list-none rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">Delete</summary>
                    <form action={deleteAction} className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                      <span className="text-sm text-rose-800">Delete this link?</span>
                      <button type="submit" className="rounded-md bg-rose-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-800">Confirm delete</button>
                    </form>
                  </details>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}