"use client";

import Image from "next/image";
import { useActionState } from "react";
import { saveProfile } from "@/app/admin/profile/actions";
import type { ProfileFormValues } from "@/types/profile";

const initialState = { success: false, message: "" };

export function ProfileForm({ profile }: { profile: ProfileFormValues | null }) {
  const [state, formAction, isPending] = useActionState(saveProfile, initialState);
// nahdaaknan
  return (
    <form action={formAction} className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Basic information</h2>
          <p className="mt-1 text-sm text-slate-500">This information is shown on your public portfolio.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Full name
            <input name="name" required maxLength={255} defaultValue={profile?.name ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Email address
            <input name="email" type="email" required maxLength={255} defaultValue={profile?.email ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 sm:col-span-2">
            Headline
            <input name="headline" required maxLength={500} defaultValue={profile?.headline ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 sm:col-span-2">
            Bio
            <textarea name="bio" required rows={5} defaultValue={profile?.bio ?? ""} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Location
            <input name="location" maxLength={255} defaultValue={profile?.location ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Phone
            <input name="phone" type="tel" maxLength={50} defaultValue={profile?.phone ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 sm:col-span-2">
            Résumé URL
            <input name="resumeUrl" type="url" maxLength={500} defaultValue={profile?.resumeUrl ?? ""} placeholder="https://example.com/resume.pdf" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">Profile image</h2>
          <p className="mt-1 text-sm text-slate-500">Upload a JPEG, PNG, or WebP image up to 5 MB.</p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-400">
            {profile?.profileImage ? (
              <Image src={profile.profileImage} alt="Current profile image" fill unoptimized sizes="112px" className="object-cover" />
            ) : (
              <span>No profile image</span>
            )}
          </div>
          <label className="flex-1 space-y-2 text-sm font-medium text-slate-700">
            Choose a new image
            <input name="profileImage" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full cursor-pointer rounded-lg border border-slate-300 text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-slate-200 file:bg-slate-50 file:px-4 file:py-2.5 file:font-medium file:text-slate-700 hover:file:bg-slate-100" />
            <span className="block text-xs font-normal text-slate-500">Leave empty to keep the current image.</span>
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>
          {state.message}
        </p>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving..." : "Save profile"}
        </button>
      </div>
    </form>
  );
}