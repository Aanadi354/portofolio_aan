"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import {
  saveBranding,
  saveGlobalSetting,
} from "@/app/admin/settings/actions";
import type { SiteSettingActionState, SiteSettingFormValue, SiteSettingType } from "@/types/site-setting";

const initialState: SiteSettingActionState = { success: false, message: "" };
const settingTypes: SiteSettingType[] = ["STRING", "NUMBER", "BOOLEAN", "JSON", "TEXT", "IMAGE"];

export function BrandingForm({
  title,
  description,
  favicon,
}: {
  title: string;
  description: string;
  favicon: string;
}) {
  const [state, formAction, isPending] = useActionState(saveBranding, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Website title <span className="text-rose-600">*</span>
          <input name="siteTitle" required maxLength={255} defaultValue={title} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Meta description
          <textarea name="siteDescription" rows={3} maxLength={500} defaultValue={description} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <p className="text-sm font-medium text-slate-700">Favicon</p>
        <p className="mt-1 text-xs text-slate-500">Upload a PNG or ICO file, maximum 1 MB.</p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <Image src="/api/site-icon" alt="Current website favicon" fill unoptimized sizes="64px" className="object-contain p-2" />
          </div>
          <div className="flex-1 space-y-3">
            <input name="faviconFile" type="file" accept="image/png,image/x-icon,.ico" className="block w-full cursor-pointer rounded-lg border border-slate-300 text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-slate-200 file:bg-slate-50 file:px-4 file:py-2.5 file:font-medium file:text-slate-700 hover:file:bg-slate-100" />
            {favicon ? <p className="text-xs text-slate-500">Current setting: {favicon}</p> : <p className="text-xs text-slate-500">Using the default favicon.</p>}
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input name="removeFavicon" type="checkbox" className="size-4 rounded border-slate-300 accent-rose-600" />
              Remove uploaded favicon and use the default
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving..." : "Save branding"}
        </button>
      </div>
    </form>
  );
}

export function GlobalSettingForm({ setting }: { setting?: SiteSettingFormValue }) {
  const [state, formAction, isPending] = useActionState(saveGlobalSetting, initialState);
  const [type, setType] = useState<SiteSettingType>(setting?.type ?? "STRING");

  return (
    <form action={formAction} className="space-y-4">
      {setting ? <input type="hidden" name="id" value={setting.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Key <span className="text-rose-600">*</span>
          <input name="key" required maxLength={100} pattern="[a-z][a-z0-9_]*" defaultValue={setting?.key ?? ""} placeholder="contact_email" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Label <span className="text-rose-600">*</span>
          <input name="label" required maxLength={255} defaultValue={setting?.label ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Group
          <input name="group" maxLength={100} defaultValue={setting?.group ?? "general"} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Value type
          <select name="type" value={type} onChange={(event) => setType(event.currentTarget.value as SiteSettingType)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            {settingTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Description <span className="font-normal text-slate-400">(optional)</span>
          <input name="description" maxLength={500} defaultValue={setting?.description ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <div className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          <label htmlFor="setting-value">Value</label>
          {type === "BOOLEAN" ? (
            <label className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-3 font-normal">
              <input id="setting-value" name="value" type="checkbox" defaultChecked={setting?.value === "true"} className="size-4 rounded border-slate-300 accent-indigo-600" />
              Enabled
            </label>
          ) : type === "JSON" || type === "TEXT" ? (
            <textarea id="setting-value" name="value" rows={type === "JSON" ? 5 : 3} defaultValue={setting?.value ?? ""} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm font-normal leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          ) : (
            <input id="setting-value" name="value" type={type === "NUMBER" ? "number" : "text"} step={type === "NUMBER" ? "any" : undefined} defaultValue={setting?.value ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          )}
          {type === "JSON" ? <p className="text-xs font-normal text-slate-500">Enter valid JSON, such as an object or array.</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving..." : setting ? "Save setting" : "Add setting"}
        </button>
      </div>
    </form>
  );
}