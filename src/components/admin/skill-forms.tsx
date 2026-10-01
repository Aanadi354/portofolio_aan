"use client";

import { useActionState } from "react";
import {
  saveSkill,
  saveSkillCategory,
} from "@/app/admin/skills/actions";
import type { SkillActionState, SkillCategoryFormValues, SkillFormValues } from "@/types/skill";

const initialState: SkillActionState = { success: false, message: "" };

export function SkillCategoryForm({ category }: { category?: SkillCategoryFormValues }) {
  const [state, formAction, isPending] = useActionState(saveSkillCategory, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Category name <span className="text-rose-600">*</span>
          <input name="name" required maxLength={100} defaultValue={category?.name ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Icon name <span className="font-normal text-slate-400">(optional)</span>
          <input name="icon" maxLength={100} defaultValue={category?.icon ?? ""} placeholder="code" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Description <span className="font-normal text-slate-400">(optional)</span>
          <input name="description" maxLength={500} defaultValue={category?.description ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Display order
          <input name="order" type="number" min="0" step="1" defaultValue={category?.order ?? 0} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving..." : category ? "Save category" : "Add category"}
        </button>
      </div>
    </form>
  );
}

export function SkillForm({
  skill,
  categoryId,
  categories,
}: {
  skill?: SkillFormValues;
  categoryId: number;
  categories: Array<{ id: number; name: string }>;
}) {
  const [state, formAction, isPending] = useActionState(saveSkill, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {skill ? <input type="hidden" name="id" value={skill.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Skill name <span className="text-rose-600">*</span>
          <input name="name" required maxLength={100} defaultValue={skill?.name ?? ""} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Category
          <select name="skillCategoryId" defaultValue={skill?.skillCategoryId ?? categoryId} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Proficiency (0-100)
          <input name="proficiency" type="number" min="0" max="100" step="1" defaultValue={skill?.proficiency ?? 0} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Icon name <span className="font-normal text-slate-400">(optional)</span>
          <input name="icon" maxLength={100} defaultValue={skill?.icon ?? ""} placeholder="php, python, nextjs" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          <span className="block text-xs font-normal text-slate-500">Use a technology key such as php, python, nextjs, or react to show its logo.</span>
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Display order
          <input name="order" type="number" min="0" step="1" defaultValue={skill?.order ?? 0} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className={`text-sm ${state.success ? "text-emerald-700" : "text-rose-700"}`}>{state.message}</p>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
          {isPending ? "Saving..." : skill ? "Save skill" : "Add skill"}
        </button>
      </div>
    </form>
  );
}