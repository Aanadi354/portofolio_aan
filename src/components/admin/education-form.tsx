"use client";

import { useActionState } from "react";
import { saveEducation } from "@/app/admin/education/actions";
import type { EducationActionState, EducationFormValues } from "@/types/education";

const initialState: EducationActionState = { success: false, message: "" };

export function EducationForm({ education }: { education?: EducationFormValues }) {
  const [state, formAction, isPending] = useActionState(saveEducation, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {education ? <input type="hidden" name="id" value={education.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Institution <span className="text-rose-600">*</span>
          <input name="institution" required maxLength={255} defaultValue={education?.institution ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Degree <span className="text-rose-600">*</span>
          <input name="degree" required maxLength={255} defaultValue={education?.degree ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Field of study <span className="text-rose-600">*</span>
          <input name="fieldOfStudy" required maxLength={255} defaultValue={education?.fieldOfStudy ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Start date <span className="text-rose-600">*</span>
          <input name="startDate" type="date" required defaultValue={education?.startDate ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          End date
          <input name="endDate" type="date" defaultValue={education?.endDate ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          GPA (0-4)
          <input name="gpa" type="number" min="0" max="4" step="0.01" defaultValue={education?.gpa ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Display order
          <input name="order" type="number" min="0" step="1" defaultValue={education?.order ?? 0} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
          <input name="isCurrent" type="checkbox" defaultChecked={education?.isCurrent ?? false} className="size-4 rounded border-slate-300 accent-indigo-600" />
          Currently studying here
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Logo URL <span className="font-normal text-slate-400">(optional)</span>
          <input name="logoUrl" type="url" maxLength={500} defaultValue={education?.logoUrl ?? ""} placeholder="https://example.com/logo.png" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Description <span className="font-normal text-slate-400">(optional)</span>
          <textarea name="description" rows={3} defaultValue={education?.description ?? ""} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>
          {state.message}
        </p>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving..." : education ? "Save changes" : "Add education"}
        </button>
      </div>
    </form>
  );
}