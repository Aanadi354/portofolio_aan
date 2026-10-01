"use client";

import Image from "next/image";
import { useActionState } from "react";
import { saveProject } from "@/app/admin/projects/actions";
import type { ProjectActionState, ProjectFormValues } from "@/types/project";

const initialState: ProjectActionState = { success: false, message: "" };

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

export function ProjectForm({ project }: { project?: ProjectFormValues }) {
  const [state, formAction, isPending] = useActionState(saveProject, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Project title <span className="text-rose-600">*</span>
          <input name="title" required maxLength={255} defaultValue={project?.title ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          URL slug <span className="text-rose-600">*</span>
          <input name="slug" required maxLength={255} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={project?.slug ?? ""} placeholder="project-name" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Short description <span className="text-rose-600">*</span>
          <textarea name="description" required maxLength={60000} rows={3} defaultValue={project?.description ?? ""} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Technologies <span className="text-rose-600">*</span>
          <input name="techStack" required defaultValue={project?.techStack.join(", ") ?? ""} placeholder="Next.js, TypeScript, MySQL" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          <span className="block text-xs font-normal text-slate-500">Separate technologies with commas.</span>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Demo URL
          <input name="liveUrl" type="url" maxLength={500} defaultValue={project?.liveUrl ?? ""} placeholder="https://example.com" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          GitHub URL
          <input name="githubUrl" type="url" maxLength={500} defaultValue={project?.githubUrl ?? ""} placeholder="https://github.com/user/project" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Status
          <select name="status" defaultValue={project?.status ?? "DRAFT"} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Display order
          <input name="order" type="number" min="0" step="1" defaultValue={project?.order ?? 0} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Start date
          <input name="startDate" type="date" defaultValue={project?.startDate ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          End date
          <input name="endDate" type="date" defaultValue={project?.endDate ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium text-slate-700">
          <input name="featured" type="checkbox" defaultChecked={project?.featured ?? false} className="size-4 rounded border-slate-300 accent-indigo-600" />
          Feature this project
        </label>
        <div className="space-y-2 sm:col-span-2">
          <p className="text-sm font-medium text-slate-700">Cover image</p>
          {project?.coverImage ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative aspect-video w-full max-w-56 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <Image src={project.coverImage} alt={`Cover image for ${project.title}`} fill unoptimized sizes="224px" className="object-cover" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input name="removeCover" type="checkbox" className="size-4 rounded border-slate-300 accent-rose-600" />
                Remove current image
              </label>
            </div>
          ) : <p className="text-sm text-slate-500">No cover image uploaded.</p>}
          <input name="coverImage" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full cursor-pointer rounded-lg border border-slate-300 text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-slate-200 file:bg-slate-50 file:px-4 file:py-2.5 file:font-medium file:text-slate-700 hover:file:bg-slate-100" />
          <span className="block text-xs text-slate-500">JPEG, PNG, or WebP. Maximum 5 MB. Leave empty to keep the current image.</span>
        </div>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Project details <span className="font-normal text-slate-400">(optional)</span>
          <textarea name="content" rows={6} maxLength={100000} defaultValue={project?.content ?? ""} className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal leading-6 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving..." : project ? "Save project" : "Add project"}
        </button>
      </div>
    </form>
  );
}