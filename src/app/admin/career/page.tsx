import { CareerForm } from "@/components/admin/career-form";
import { deleteCareer } from "@/app/admin/career/actions";
import { prisma } from "@/lib/prisma";
import type { CareerFormValues } from "@/types/career";

export const dynamic = "force-dynamic";

const careerTypeLabels: Record<string, string> = {
  FULLTIME: "Full-time",
  PARTTIME: "Part-time",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
  CONTRACT: "Contract",
  VOLUNTEER: "Volunteer",
};

function formatDateRange(startDate: Date, endDate: Date | null, isCurrent: boolean) {
  const format = (date: Date) => new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
  return `${format(startDate)} - ${isCurrent ? "Present" : endDate ? format(endDate) : "End date not set"}`;
}

export default async function AdminCareerPage() {
  const records = await prisma.career.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }, { id: "desc" }],
  });

  const careerRecords: CareerFormValues[] = records.map((record) => ({
    id: record.id,
    company: record.company,
    position: record.position,
    type: record.type,
    startDate: record.startDate.toISOString().slice(0, 10),
    endDate: record.endDate?.toISOString().slice(0, 10) ?? "",
    isCurrent: record.isCurrent,
    location: record.location ?? "",
    description: record.description ?? "",
    logoUrl: record.logoUrl ?? "",
    order: record.order,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Public content</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Career</h1>
        <p className="mt-1 text-sm text-slate-500">Manage roles, work history, and professional experience.</p>
      </header>

      <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:px-7">
          <span>
            <span className="block font-semibold text-slate-900">Add career</span>
            <span className="mt-1 block text-sm text-slate-500">Create a role or work experience entry.</span>
          </span>
          <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-500 transition group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-slate-100 p-5 sm:p-7">
          <CareerForm />
        </div>
      </details>

      <section aria-label="Career entries" className="space-y-4">
        {careerRecords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="font-semibold text-slate-800">No career entries yet</h2>
            <p className="mt-1 text-sm text-slate-500">Use Add career to create your first entry.</p>
          </div>
        ) : careerRecords.map((career) => {
          const deleteAction = deleteCareer.bind(null, career.id);

          return (
            <article key={career.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">{formatDateRange(new Date(`${career.startDate}T00:00:00.000Z`), career.endDate ? new Date(`${career.endDate}T00:00:00.000Z`) : null, career.isCurrent)}</p>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{career.position}</h2>
                  <p className="mt-1 text-sm text-slate-600">{career.company}{career.location ? ` · ${career.location}` : ""}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{careerTypeLabels[career.type] ?? career.type}</span>
                    {career.isCurrent ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Current</span> : null}
                  </div>
                  {career.description ? <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-slate-600">{career.description}</p> : null}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-7">
                <details>
                  <summary className="cursor-pointer list-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Edit</summary>
                  <div className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                    <CareerForm career={career} />
                  </div>
                </details>
                <details>
                  <summary className="cursor-pointer list-none rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">Delete</summary>
                  <form action={deleteAction} className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <span className="text-sm text-rose-800">Delete this career entry?</span>
                    <button type="submit" className="rounded-md bg-rose-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-800">Confirm delete</button>
                  </form>
                </details>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}