"use client";

import { useActionState } from "react";
import { saveSocialLink } from "@/app/admin/social-links/actions";
import type { SocialLinkActionState, SocialLinkFormValues } from "@/types/social-link";

const initialState: SocialLinkActionState = { success: false, message: "" };

export function SocialLinkForm({ link }: { link?: SocialLinkFormValues }) {
  const [state, formAction, isPending] = useActionState(saveSocialLink, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {link ? <input type="hidden" name="id" value={link.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Platform <span className="text-rose-600">*</span>
          <input name="platform" required maxLength={100} defaultValue={link?.platform ?? ""} placeholder="GitHub" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Link label <span className="text-rose-600">*</span>
          <input name="label" required maxLength={100} defaultValue={link?.label ?? ""} placeholder="Visit my GitHub" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          URL <span className="text-rose-600">*</span>
          <input name="url" type="url" required maxLength={500} defaultValue={link?.url ?? ""} placeholder="https://github.com/username" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Icon name <span className="font-normal text-slate-400">(optional)</span>
          <input name="icon" maxLength={100} defaultValue={link?.icon ?? ""} placeholder="github" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Display order
          <input name="order" type="number" min="0" step="1" defaultValue={link?.order ?? 0} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
          <input name="isActive" type="checkbox" defaultChecked={link?.isActive ?? true} className="size-4 rounded border-slate-300 accent-indigo-600" />
          Show this link on the public portfolio
        </label>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving..." : link ? "Save changes" : "Add social link"}
        </button>
      </div>
    </form>
  );
}