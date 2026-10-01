"use client";

import { useActionState } from "react";
import { saveCareer } from "@/app/admin/career/actions";
import type { CareerActionState, CareerFormValues } from "@/types/career";

const initialState: CareerActionState = { success: false, message: "" };

const careerTypeOptions = [
  { value: "FULLTIME", label: "Full-time" },
  { value: "PARTTIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "CONTRACT", label: "Contract" },
  { value: "VOLUNTEER", label: "Volunteer" },
];

export function CareerForm({ career }: { career?: CareerFormValues }) {
  const [state, formAction, isPending] = useActionState(saveCareer, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {career ? <input type="hidden" name="id" value={career.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Company <span className="text-rose-600">*</span>
          <input name="company" required maxLength={255} defaultValue={career?.company ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Position <span className="text-rose-600">*</span>
          <input name="position" required maxLength={255} defaultValue={career?.position ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Employment type
          <select name="type" defaultValue={career?.type ?? "FULLTIME"} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            {careerTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Location
          <input name="location" maxLength={255} defaultValue={career?.location ?? ""} placeholder="Remote or city, country" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Start date <span className="text-rose-600">*</span>
          <input name="startDate" type="date" required defaultValue={career?.startDate ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          End date
          <input name="endDate" type="date" defaultValue={career?.endDate ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Logo URL <span className="font-normal text-slate-400">(optional)</span>
          <input name="logoUrl" type="url" maxLength={500} defaultValue={career?.logoUrl ?? ""} placeholder="https://example.com/logo.png" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Description <span className="font-normal text-slate-400">(optional)</span>
          <textarea name="description" rows={4} defaultValue={career?.description ?? ""} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Display order
          <input name="order" type="number" min="0" step="1" defaultValue={career?.order ?? 0} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
          <input name="isCurrent" type="checkbox" defaultChecked={career?.isCurrent ?? false} className="size-4 rounded border-slate-300 accent-indigo-600" />
          I currently work here
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>
          {state.message}
        </p>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving..." : career ? "Save changes" : "Add career"}
        </button>
      </div>
    </form>
  );
}