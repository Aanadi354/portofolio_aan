import { EducationForm } from "@/components/admin/education-form";
import { deleteEducation } from "@/app/admin/education/actions";
import { prisma } from "@/lib/prisma";
import type { EducationFormValues } from "@/types/education";

export const dynamic = "force-dynamic";

function formatDateRange(startDate: Date, endDate: Date | null, isCurrent: boolean) {
  const format = (date: Date) => new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
  return `${format(startDate)} - ${isCurrent ? "Present" : endDate ? format(endDate) : "End date not set"}`;
}

export default async function AdminEducationPage() {
  const records = await prisma.education.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }, { id: "desc" }],
  });

  const educationRecords: EducationFormValues[] = records.map((record) => ({
    id: record.id,
    institution: record.institution,
    degree: record.degree,
    fieldOfStudy: record.fieldOfStudy,
    startDate: record.startDate.toISOString().slice(0, 10),
    endDate: record.endDate?.toISOString().slice(0, 10) ?? "",
    isCurrent: record.isCurrent,
    gpa: record.gpa?.toString() ?? "",
    description: record.description ?? "",
    logoUrl: record.logoUrl ?? "",
    order: record.order,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Public content</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Education</h1>
        <p className="mt-1 text-sm text-slate-500">Manage schools, degrees, and study history shown on your portfolio.</p>
      </header>

      <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:px-7">
          <span>
            <span className="block font-semibold text-slate-900">Add education</span>
            <span className="mt-1 block text-sm text-slate-500">Create a new education entry.</span>
          </span>
          <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-500 transition group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-slate-100 p-5 sm:p-7">
          <EducationForm />
        </div>
      </details>

      <section aria-label="Education entries" className="space-y-4">
        {educationRecords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="font-semibold text-slate-800">No education entries yet</h2>
            <p className="mt-1 text-sm text-slate-500">Use Add education to create your first entry.</p>
          </div>
        ) : educationRecords.map((education) => {
          const deleteAction = deleteEducation.bind(null, education.id);

          return (
            <article key={education.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">{formatDateRange(new Date(`${education.startDate}T00:00:00.000Z`), education.endDate ? new Date(`${education.endDate}T00:00:00.000Z`) : null, education.isCurrent)}</p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{education.institution}</h2>
                  <p className="mt-1 text-sm text-slate-600">{education.degree} · {education.fieldOfStudy}</p>
                  {education.gpa ? <p className="mt-2 text-xs text-slate-500">GPA {education.gpa}</p> : null}
                  {education.description ? <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-slate-600">{education.description}</p> : null}
                </div>
                {education.isCurrent ? <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Current</span> : null}
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-7">
                <details className="group/edit">
                  <summary className="cursor-pointer list-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Edit</summary>
                  <div className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                    <EducationForm education={education} />
                  </div>
                </details>
                <form action={deleteAction}>
                  <button type="submit" className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">Delete</button>
                </form>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}