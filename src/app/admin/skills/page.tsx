import {
  deleteSkill,
  deleteSkillCategory,
} from "@/app/admin/skills/actions";
import { SkillCategoryForm, SkillForm } from "@/components/admin/skill-forms";
import { prisma } from "@/lib/prisma";
import type { SkillCategoryFormValues } from "@/types/skill";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const categories = await prisma.skillCategory.findMany({
    include: { skills: { orderBy: [{ order: "asc" }, { name: "asc" }] } },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  const categoryValues: SkillCategoryFormValues[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description ?? "",
    icon: category.icon ?? "",
    order: category.order,
    skills: category.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      proficiency: skill.proficiency,
      icon: skill.icon ?? "",
      order: skill.order,
      skillCategoryId: skill.skillCategoryId,
    })),
  }));
  const categoryOptions = categoryValues.map(({ id, name }) => ({ id, name }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Public content</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Skills</h1>
        <p className="mt-1 text-sm text-slate-500">Organize your skills into categories and set proficiency levels.</p>
      </header>

      <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:px-7">
          <span>
            <span className="block font-semibold text-slate-900">Add category</span>
            <span className="mt-1 block text-sm text-slate-500">Create a group for related skills.</span>
          </span>
          <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-500 transition group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-slate-100 p-5 sm:p-7">
          <SkillCategoryForm />
        </div>
      </details>

      <section aria-label="Skill categories" className="space-y-4">
        {categoryValues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="font-semibold text-slate-800">No skill categories yet</h2>
            <p className="mt-1 text-sm text-slate-500">Create a category, then add skills to it.</p>
          </div>
        ) : categoryValues.map((category) => {
          const deleteCategoryAction = deleteSkillCategory.bind(null, category.id);

          return (
            <article key={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <header className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
                <div>
                  <p className="text-xs font-medium text-slate-500">{category.skills.length} skill{category.skills.length === 1 ? "" : "s"}</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{category.name}</h2>
                  {category.description ? <p className="mt-1 text-sm text-slate-500">{category.description}</p> : null}
                </div>
                <details>
                  <summary className="cursor-pointer list-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Edit category</summary>
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                    <SkillCategoryForm category={category} />
                  </div>
                </details>
              </header>

              <div className="p-5 sm:px-7">
                <details className="group/skill rounded-xl border border-dashed border-slate-300">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50/60">
                    Add skill <span aria-hidden="true" className="text-lg">+</span>
                  </summary>
                  <div className="border-t border-slate-200 p-4 sm:p-5">
                    <SkillForm categoryId={category.id} categories={categoryOptions} />
                  </div>
                </details>

                {category.skills.length > 0 ? (
                  <ul className="mt-3 divide-y divide-slate-100">
                    {category.skills.map((skill) => {
                      const deleteSkillAction = deleteSkill.bind(null, skill.id);

                      return (
                        <li key={skill.id} className="py-4 first:pt-2 last:pb-2">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-medium text-slate-800">{skill.name}</span>
                                <span className="text-xs tabular-nums text-slate-500">{skill.proficiency}%</span>
                              </div>
                              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${skill.proficiency}%` }} />
                              </div>
                            </div>
                            <details>
                              <summary className="cursor-pointer list-none rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Edit</summary>
                              <div className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                                <SkillForm skill={skill} categoryId={category.id} categories={categoryOptions} />
                              </div>
                            </details>
                            <details>
                              <summary className="cursor-pointer list-none rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">Delete</summary>
                              <form action={deleteSkillAction} className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                                <span className="text-sm text-rose-800">Delete {skill.name}?</span>
                                <button type="submit" className="rounded-md bg-rose-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-800">Confirm delete</button>
                              </form>
                            </details>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="py-5 text-sm text-slate-500">No skills in this category yet.</p>
                )}
              </div>

              <footer className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-7">
                <details>
                  <summary className="w-fit cursor-pointer list-none rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">Delete category</summary>
                  <form action={deleteCategoryAction} className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <span className="text-sm text-rose-800">This also deletes all {category.skills.length} skill{category.skills.length === 1 ? "" : "s"} in this category.</span>
                    <button type="submit" className="rounded-md bg-rose-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-800">Confirm delete category</button>
                  </form>
                </details>
              </footer>
            </article>
          );
        })}
      </section>
    </div>
  );
}