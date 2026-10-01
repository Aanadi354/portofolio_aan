import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Code,
  Github,
  Globe,
  Mail,
  MapPin,
  Spark,
} from "iconoir-react";
import { SkillIcon, SkillLogo } from "@/components/public/skill-logo";
import type { PublicPortfolioData } from "@/services/public-portfolio";

const careerTypeLabels: Record<string, string> = {
  FULLTIME: "Full-time",
  PARTTIME: "Part-time",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
  CONTRACT: "Contract",
  VOLUNTEER: "Volunteer",
};

function formatPeriod(startDate: Date, endDate: Date | null, isCurrent: boolean) {
  const formatDate = (date: Date) => new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

  return `${formatDate(startDate)} - ${isCurrent ? "Present" : endDate ? formatDate(endDate) : "End date not listed"}`;
}

export function LandingPage({ data }: { data: PublicPortfolioData }) {
  const { profile, careers, education, projects, socialLinks, skillCategories } = data;
  const totalSkills = skillCategories.reduce((total, category) => total + category.skills.length, 0);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7faf8] text-[#173c34]">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="#home" className="flex items-center gap-3" aria-label="Back to home">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#174d40] text-white">
            <Spark className="size-5" />
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#668078]">Portfolio</span>
            <span className="block text-sm font-semibold">{profile?.name ?? "Personal Portfolio"}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[#557068] md:flex" aria-label="Main navigation">
          <a href="#about" className="transition-colors hover:text-[#173c34]">About</a>
          <a href="#skills" className="transition-colors hover:text-[#173c34]">Skills</a>
          {careers.length > 0 ? <a href="#experience" className="transition-colors hover:text-[#173c34]">Experience</a> : null}
          {education.length > 0 ? <a href="#education" className="transition-colors hover:text-[#173c34]">Education</a> : null}
          <a href="#projects" className="transition-colors hover:text-[#173c34]">Work</a>
        </nav>

        <a
          href={profile?.email ? `mailto:${profile.email}` : "#contact"}
          className="inline-flex items-center gap-2 rounded-lg bg-[#174d40] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#236858]"
        >
          Get in touch <ArrowUpRight className="size-4" />
        </a>
      </header>

      <main>
        <section id="home" className="relative isolate mx-auto max-w-7xl px-6 pb-16 pt-12 lg:px-10 lg:pb-24 lg:pt-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 top-0 -z-10 h-[min(680px,90%)] overflow-hidden rounded-4xl bg-[radial-gradient(ellipse_at_78%_22%,rgba(160,220,194,0.55),transparent_32%),radial-gradient(ellipse_at_12%_90%,rgba(255,210,184,0.45),transparent_34%),linear-gradient(135deg,#f1f8f4_0%,#fbfcf9_58%,#f4f8f5_100%)]"
          >
            <div className="absolute inset-0 opacity-[0.22] bg-[linear-gradient(rgba(23,60,52,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(23,60,52,0.14)_1px,transparent_1px)] bg-size-[34px_34px] mask-[linear-gradient(to_bottom,black,transparent_88%)]" />
            <div className="absolute -right-24 -top-44 size-112 rounded-full bg-[#89c9ab]/25 blur-3xl" />
          </div>

          <div className={`grid items-center gap-12 ${profile?.profileImage ? "md:grid-cols-[1.1fr_0.7fr]" : "md:grid-cols-1"}`}>
            <div className="max-w-3xl py-8 lg:py-14">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b8d9c9] bg-white/75 px-3.5 py-2 text-xs font-semibold text-[#316b55] shadow-sm shadow-[#174d40]/5">
                <span className="size-1.5 rounded-full bg-[#4eaa78]" />
                Open to thoughtful collaborations
              </div>

              <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#173c34]">
                {profile?.headline ?? "Thoughtful digital work, made with care."}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-[#587169]">
                {profile?.bio ?? "A little introduction is on its way."}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#174d40] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#236858]"
                >
                  Explore my work <ArrowRight className="size-4" />
                </a>
                {profile?.resumeUrl ? (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#d3e0d9] bg-white/80 px-5 py-3 text-sm font-semibold text-[#315b4e] transition hover:border-[#8cb6a1]"
                  >
                    View résumé <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
              </div>

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#668078]">
                {profile?.location ? (
                  <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-[#4c9270]" />{profile.location}</span>
                ) : null}
                {profile?.email ? (
                  <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-[#173c34]">
                    <Mail className="size-4 text-[#d47f5c]" />{profile.email}
                  </a>
                ) : null}
              </div>
            </div>

            {profile?.profileImage ? (
              <div className="relative mx-auto w-full max-w-97.5">
                <div className="absolute -inset-3 -rotate-3 rounded-3xl border border-[#b7d9c6] bg-[#dceee3]" />
                <div className="relative aspect-4/5 overflow-hidden rounded-[1.25rem] border border-white bg-[#e6eee8] shadow-[0_24px_70px_-34px_rgba(23,60,52,0.4)]">
                  <Image
                    src={profile.profileImage}
                    alt={profile.name ? `Portrait of ${profile.name}` : "Portfolio owner portrait"}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 90vw, 390px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 flex size-14 items-center justify-center rounded-2xl border border-[#d4e7dc] bg-white text-[#39795d] shadow-lg shadow-[#174d40]/10">
                  <Spark className="size-6" />
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-12">
          <div className="grid divide-y divide-[#dce7e1] border-y border-[#dce7e1] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { label: "Selected projects", value: projects.length.toString() },
              { label: "Skills in practice", value: totalSkills.toString() },
              { label: "Based in", value: profile?.location ?? "Anywhere" },
            ].map((item) => (
              <div key={item.label} className="py-5 sm:px-7 sm:py-6 first:sm:pl-0 last:sm:pr-0">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#789087]">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-[#244b40]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {skillCategories.length > 0 ? (
          <section id="skills" className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
            <div className="mb-9 flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4a8c6d]">What I work with</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#173c34]">Skills & tools</h2>
              </div>
              <Spark className="hidden size-7 text-[#d47f5c] sm:block" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {skillCategories.map((category) => (
                <article
                  key={category.id}
                  className="group relative overflow-hidden rounded-xl border border-[#dce7e1] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#9fc9b1] hover:shadow-[0_18px_45px_-30px_rgba(23,60,52,0.38)]"
                >
                  <div className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-[#cce8d7]/0 blur-2xl transition-colors duration-500 group-hover:bg-[#cce8d7]/80" />
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#edf6f0] text-[#448164]">
                        <Code className="size-5" />
                      </span>
                      <div>
                        <h3 className="font-semibold text-[#244b40]">{category.name}</h3>
                        {category.description ? <p className="mt-1 text-sm leading-6 text-[#789087]">{category.description}</p> : null}
                      </div>
                    </div>
                    <div role="list" aria-label={`${category.name} technologies`} className="mt-5 flex flex-wrap gap-1">
                      {category.skills.map((skill) => (
                        <SkillLogo key={skill.id} name={skill.name} icon={skill.icon} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {careers.length > 0 || education.length > 0 ? (
          <section className="bg-white py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="mb-10 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4a8c6d]">The path so far</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#173c34] sm:text-4xl">Experience & education</h2>
              </div>

              <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
                {careers.length > 0 ? (
                  <div id="experience" className="scroll-mt-8">
                    <h3 className="mb-7 text-xl font-semibold text-[#244b40]">Experience</h3>
                    <ol className="space-y-8 border-l border-[#cfe0d5]">
                      {careers.map((career) => (
                        <li key={career.id} className="relative pl-7">
                          <span aria-hidden="true" className="absolute -left-1.25 top-1.5 size-2.5 rounded-full border-2 border-white bg-[#4a8c6d] ring-1 ring-[#9fc9b1]" />
                          <p className="text-xs font-medium text-[#71867d]">{formatPeriod(career.startDate, career.endDate, career.isCurrent)}</p>
                          <div className="mt-2 flex items-start gap-3">
                            {career.logoUrl ? (
                              <Image src={career.logoUrl} alt={`${career.company} logo`} width={40} height={40} unoptimized className="size-10 shrink-0 rounded-lg border border-[#e1eae4] bg-white object-contain p-1" />
                            ) : null}
                            <div className="min-w-0">
                              <h4 className="font-semibold text-[#244b40]">{career.position}</h4>
                              <p className="mt-0.5 text-sm text-[#587169]">{career.company}{career.location ? ` · ${career.location}` : ""}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-md bg-[#edf6f0] px-2 py-1 text-[11px] font-medium text-[#39795d]">{careerTypeLabels[career.type] ?? career.type}</span>
                            {career.isCurrent ? <span className="rounded-md bg-[#fff2e8] px-2 py-1 text-[11px] font-medium text-[#b66b48]">Current</span> : null}
                          </div>
                          {career.description ? <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#71867d]">{career.description}</p> : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                {education.length > 0 ? (
                  <div id="education" className="scroll-mt-8">
                    <h3 className="mb-7 text-xl font-semibold text-[#244b40]">Education</h3>
                    <ol className="space-y-8 border-l border-[#cfe0d5]">
                      {education.map((item) => (
                        <li key={item.id} className="relative pl-7">
                          <span aria-hidden="true" className="absolute -left-1.25 top-1.5 size-2.5 rounded-full border-2 border-white bg-[#d47f5c] ring-1 ring-[#efc4ae]" />
                          <p className="text-xs font-medium text-[#71867d]">{formatPeriod(item.startDate, item.endDate, item.isCurrent)}</p>
                          <div className="mt-2 flex items-start gap-3">
                            {item.logoUrl ? (
                              <Image src={item.logoUrl} alt={`${item.institution} logo`} width={40} height={40} unoptimized className="size-10 shrink-0 rounded-lg border border-[#e1eae4] bg-white object-contain p-1" />
                            ) : null}
                            <div className="min-w-0">
                              <h4 className="font-semibold text-[#244b40]">{item.institution}</h4>
                              <p className="mt-0.5 text-sm text-[#587169]">{item.degree} · {item.fieldOfStudy}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {item.isCurrent ? <span className="rounded-md bg-[#edf6f0] px-2 py-1 text-[11px] font-medium text-[#39795d]">Currently studying</span> : null}
                            {item.gpa ? <span className="rounded-md bg-[#f5f1eb] px-2 py-1 text-[11px] font-medium text-[#806b4c]">GPA {item.gpa}</span> : null}
                          </div>
                          {item.description ? <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#71867d]">{item.description}</p> : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {projects.length > 0 ? (
          <section id="projects" className="bg-[#edf4ef] py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
              <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4a8c6d]">Selected work</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#173c34]">A few things I&apos;ve made</h2>
                </div>
                <span className="text-sm text-[#789087]">{projects.length} project{projects.length === 1 ? "" : "s"}</span>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="group relative overflow-hidden rounded-xl border border-[#dce7e1] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#9fc9b1] hover:shadow-[0_22px_55px_-32px_rgba(23,60,52,0.38)]"
                  >
                    <div className="relative aspect-16/10 overflow-hidden bg-[radial-gradient(ellipse_at_70%_20%,rgba(166,215,185,0.8),transparent_42%),linear-gradient(145deg,#e5f0e8,#f7eee7)]">
                      {project.coverImage ? (
                        <Image src={project.coverImage} alt={project.title} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <div aria-hidden="true" className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(23,60,52,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(23,60,52,0.12)_1px,transparent_1px)] bg-size-[24px_24px]" />
                      )}
                      {project.featured ? (
                        <span className="absolute left-4 top-4 rounded-md border border-white/80 bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-[#39795d] backdrop-blur">Featured</span>
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-[#244b40]">{project.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#71867d]">{project.description}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span key={`${project.id}-${tech}`} className="inline-flex items-center gap-1.5 rounded-md bg-[#f1f6f3] px-2 py-1 text-[11px] font-medium text-[#527064]">
                            <SkillIcon name={tech} icon={null} className="size-3.5" />
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center gap-4 border-t border-[#edf2ee] pt-4">
                        {project.liveUrl ? (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#39795d] hover:text-[#173c34]">
                            <Globe className="size-4" /> Live site <ArrowUpRight className="size-3.5" />
                          </a>
                        ) : null}
                        {project.githubUrl ? (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#39795d] hover:text-[#173c34]">
                            <Github className="size-4" /> Source <ArrowUpRight className="size-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="contact" className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="relative overflow-hidden rounded-2xl border border-[#d5e5db] bg-[#eaf4ed] px-7 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-32 size-72 rounded-full bg-[#b7ddc4]/50 blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4a8c6d]">Have a good project in mind?</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#173c34]">Let&apos;s make something meaningful.</h2>
            </div>
            <div className="relative mt-7 flex flex-wrap gap-3 lg:mt-0">
              {profile?.email ? (
                <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-lg bg-[#174d40] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#236858]">
                  <Mail className="size-4" /> Say hello <ArrowUpRight className="size-4" />
                </a>
              ) : null}
              {socialLinks.slice(0, 2).map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#c6dbcd] bg-white/70 px-4 py-3 text-sm font-medium text-[#315b4e] transition hover:border-[#8cb6a1]">
                  {link.platform.toLowerCase().includes("github") ? <Github className="size-4" /> : <Globe className="size-4" />}
                  {link.label} <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e1eae4] bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-xs text-[#789087] sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} {profile?.name ?? "Personal Portfolio"}</p>
          {profile?.email ? <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 hover:text-[#173c34]"><Mail className="size-3.5" />{profile.email}</a> : null}
        </div>
      </footer>
    </div>
  );
}