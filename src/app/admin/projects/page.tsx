import Image from "next/image";
import { deleteProject } from "@/app/admin/projects/actions";
import { ProjectForm } from "@/components/admin/project-form";
import { prisma } from "@/lib/prisma";
import type { ProjectFormValues } from "@/types/project";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const records = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });

  const projects: ProjectFormValues[] = records.map((project) => {
    let techStack: string[];
    try {
      const parsed: unknown = JSON.parse(project.techStack);
      techStack = Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
        ? parsed
        : project.techStack.split(",").map((item) => item.trim()).filter(Boolean);
    } catch {
      techStack = project.techStack.split(",").map((item) => item.trim()).filter(Boolean);
    }

    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content ?? "",
      coverImage: project.coverImage ?? "",
      techStack,
      liveUrl: project.liveUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      status: project.status,
      featured: project.featured,
      order: project.order,
      startDate: project.startDate?.toISOString().slice(0, 10) ?? "",
      endDate: project.endDate?.toISOString().slice(0, 10) ?? "",
    };
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Public content</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Projects</h1>
        <p className="mt-1 text-sm text-slate-500">Manage portfolio projects, cover images, and destination links.</p>
      </header>

      <details className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:px-7">
          <span>
            <span className="block font-semibold text-slate-900">Add project</span>
            <span className="mt-1 block text-sm text-slate-500">Create a project entry for your portfolio.</span>
          </span>
          <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-500 transition group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-slate-100 p-5 sm:p-7">
          <ProjectForm />
        </div>
      </details>

      <section aria-label="Project list" className="space-y-4">
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="font-semibold text-slate-800">No projects yet</h2>
            <p className="mt-1 text-sm text-slate-500">Use Add project to create your first entry.</p>
          </div>
        ) : projects.map((project) => {
          const deleteAction = deleteProject.bind(null, project.id);

          return (
            <article key={project.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid md:grid-cols-[220px_1fr]">
                <div className="relative aspect-video bg-slate-100 md:aspect-auto md:min-h-44">
                  {project.coverImage ? (
                    <Image src={project.coverImage} alt={`Cover image for ${project.title}`} fill unoptimized sizes="220px" className="object-cover" />
                  ) : <div className="flex h-full min-h-36 items-center justify-center text-sm text-slate-400">No cover image</div>}
                </div>
                <div className="min-w-0 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-900">{project.title}</h2>
                        {project.featured ? <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Featured</span> : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">/{project.slug}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${project.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : project.status === "DRAFT" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"}`}>
                      {project.status.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.map((technology) => <span key={`${project.id}-${technology}`} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{technology}</span>)}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-700">Demo ↗</a> : null}
                    {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-700">GitHub ↗</a> : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">
                <details>
                  <summary className="cursor-pointer list-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Edit</summary>
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                    <ProjectForm project={project} />
                  </div>
                </details>
                <details>
                  <summary className="cursor-pointer list-none rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">Delete</summary>
                  <form action={deleteAction} className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <span className="text-sm text-rose-800">Delete {project.title}?</span>
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