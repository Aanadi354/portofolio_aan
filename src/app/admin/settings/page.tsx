import {
  deleteGlobalSetting,
} from "@/app/admin/settings/actions";
import { BrandingForm, GlobalSettingForm } from "@/components/admin/site-setting-forms";
import { prisma } from "@/lib/prisma";
import type { SiteSettingFormValue } from "@/types/site-setting";

export const dynamic = "force-dynamic";

const brandingKeys = new Set(["site_title", "site_description", "favicon"]);

export default async function AdminSettingsPage() {
  const records = await prisma.siteSetting.findMany({ orderBy: [{ group: "asc" }, { label: "asc" }] });
  const settings: SiteSettingFormValue[] = records.map((setting) => ({
    id: setting.id,
    key: setting.key,
    value: setting.value ?? "",
    type: setting.type,
    label: setting.label,
    description: setting.description ?? "",
    group: setting.group,
  }));
  const branding = Object.fromEntries(settings.filter((setting) => brandingKeys.has(setting.key)).map((setting) => [setting.key, setting.value]));
  const globalSettings = settings.filter((setting) => !brandingKeys.has(setting.key));

  const settingsByGroup = Map.groupBy(globalSettings, (setting) => setting.group || "general");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Website configuration</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Site Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Control public branding and global settings for the website.</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Branding</h2>
          <p className="mt-1 text-sm text-slate-500">These values update the site title, search description, and browser icon.</p>
        </div>
        <BrandingForm
          title={branding.site_title ?? "Personal Portfolio"}
          description={branding.site_description ?? ""}
          favicon={branding.favicon ?? ""}
        />
      </section>

      <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:px-7">
          <span>
            <span className="block font-semibold text-slate-900">Add global setting</span>
            <span className="mt-1 block text-sm text-slate-500">Create a typed setting and assign it to a group.</span>
          </span>
          <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-500 transition group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-slate-100 p-5 sm:p-7"><GlobalSettingForm /></div>
      </details>

      <section aria-label="Global settings" className="space-y-6">
        {globalSettings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="font-semibold text-slate-800">No global settings yet</h2>
            <p className="mt-1 text-sm text-slate-500">Add a setting to configure contact, theme, or site behavior.</p>
          </div>
        ) : Array.from(settingsByGroup.entries()).map(([group, groupSettings]) => (
          <div key={group}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{group}</h2>
            <div className="space-y-3">
              {groupSettings.map((setting) => {
                const deleteAction = deleteGlobalSetting.bind(null, setting.id);

                return (
                  <article key={setting.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:px-6">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{setting.label}</h3>
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">{setting.type}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500"><code>{setting.key}</code> · {setting.group}</p>
                        {setting.description ? <p className="mt-2 text-sm text-slate-600">{setting.description}</p> : null}
                        <p className="mt-2 max-w-3xl break-all text-sm text-slate-700">{setting.type === "BOOLEAN" ? (setting.value === "true" ? "Enabled" : "Disabled") : setting.value || "(empty)"}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <details>
                          <summary className="cursor-pointer list-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Edit</summary>
                          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                            <GlobalSettingForm setting={setting} />
                          </div>
                        </details>
                        <details>
                          <summary className="cursor-pointer list-none rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">Delete</summary>
                          <form action={deleteAction} className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                            <span className="text-sm text-rose-800">Delete this setting?</span>
                            <button type="submit" className="rounded-md bg-rose-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-800">Confirm delete</button>
                          </form>
                        </details>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}