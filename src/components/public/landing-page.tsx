import Link from "next/link";
import { ArrowRight, Code2, Globe, Mail, MapPin, Sparkles, Star } from "lucide-react";
import type { PublicPortfolioData } from "@/services/public-portfolio";

export function LandingPage({ data }: { data: PublicPortfolioData }) {
  const { profile, projects, socialLinks, skillCategories } = data;

  const fallbackProfile = {
    name: "Your Name",
    headline: "I build digital experiences that feel premium and human.",
    bio:
      "I design and develop modern experiences for brands, startups, and companies that want to turn ideas into momentum.",
    location: "Indonesia",
    email: "hello@example.com",
    phone: null,
    profileImage: null,
    resumeUrl: null,
  };

  const activeProfile = profile ?? fallbackProfile;
  const displayProjects = projects.length > 0 ? projects : [
    {
      id: 1,
      title: "Brand Experience Platform",
      slug: "brand-experience-platform",
      description: "A polished digital experience for scaling brands with measurable engagement.",
      coverImage: null,
      techStack: ["Next.js", "Prisma", "MySQL"],
      liveUrl: null,
      githubUrl: null,
      featured: true,
      status: "PUBLISHED",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-10 top-32 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(168,85,247,0.25)]">
            <Sparkles className="h-5 w-5 text-fuchsia-300" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">Portfolio</p>
            <p className="text-base font-semibold text-white">{activeProfile.name}</p>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#about" className="transition hover:text-white">About</a>
          <a href="#skills" className="transition hover:text-white">Skills</a>
          <a href="#projects" className="transition hover:text-white">Projects</a>
          <a href="#contact" className="transition hover:text-white">Contact</a>
        </nav>

        <Link
          href={activeProfile.email ? `mailto:${activeProfile.email}` : "#contact"}
          className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-100 transition hover:border-fuchsia-300/60 hover:bg-fuchsia-500/20"
        >
          Let&apos;s Talk
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <section className="grid items-center gap-10 py-14 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
              <Star className="h-3.5 w-3.5" />
              Available for selected work
            </div>

            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              {activeProfile.headline}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              {activeProfile.bio}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
              >
                View Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={activeProfile.resumeUrl ?? "#contact"}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
              >
                Download CV
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-5 text-sm text-slate-300">
              {activeProfile.location ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  {activeProfile.location}
                </div>
              ) : null}
              <a
                href={`mailto:${activeProfile.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-fuchsia-300/50"
              >
                <Mail className="h-4 w-4 text-fuchsia-300" />
                {activeProfile.email}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_80px_rgba(168,85,247,0.15)] backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950 p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.35),_transparent_45%)]" />

                <div className="relative flex items-center justify-between pb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Profile</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">{activeProfile.name}</h2>
                  </div>
                  <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-200">
                    Online
                  </div>
                </div>

                <div className="relative mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus</p>
                    <p className="mt-3 text-lg font-semibold text-white">Product</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Style</p>
                    <p className="mt-3 text-lg font-semibold text-white">Premium</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Impact</p>
                    <p className="mt-3 text-lg font-semibold text-white">Results</p>
                  </div>
                </div>

                <div className="relative mt-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current stack</p>
                      <p className="mt-2 text-sm font-medium text-fuchsia-100">Next.js • TypeScript • Prisma</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/20 text-fuchsia-200">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-8 md:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Experience", value: "4+ Years" },
              { label: "Projects", value: `${displayProjects.length}+` },
              { label: "Industries", value: "Startup / SaaS / Brand" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-3 text-2xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="py-8 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Capabilities</p>
              <h3 className="mt-3 text-3xl font-bold text-white">Tools and craft</h3>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {skillCategories.map((category) => (
              <div key={category.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 text-cyan-200">
                    {category.icon ?? "✦"}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">{category.name}</h4>
                    {category.description ? <p className="text-sm text-slate-400">{category.description}</p> : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1.5 text-sm text-slate-200"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="py-8 md:py-16">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-300">Selected work</p>
            <h3 className="mt-3 text-3xl font-bold text-white">Projects that move brands forward</h3>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {displayProjects.map((project) => (
              <article key={project.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_0_60px_rgba(15,23,42,0.7)] transition hover:-translate-y-1 hover:border-fuchsia-400/30">
                <div className="h-48 bg-gradient-to-br from-fuchsia-500/20 via-slate-900 to-cyan-500/20 p-5">
                  <div className="flex h-full items-end justify-between rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-200">
                      {project.status}
                    </span>
                    {project.featured ? (
                      <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-200">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-semibold text-white">{project.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{project.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span key={`${project.id}-${tech}`} className="rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 text-[11px] text-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white">
                          <Globe className="h-4 w-4" />
                          Live
                        </a>
                      ) : null}
                    </div>
                    {project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-slate-300 hover:text-white">
                        <Code2 className="h-4 w-4" />
                        Code
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="py-8 md:py-16">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-slate-900 to-cyan-500/10 p-8 md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Let&apos;s build</p>
                <h3 className="mt-3 text-3xl font-bold text-white md:text-5xl">Need a standout product experience?</h3>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${activeProfile.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  <Mail className="h-4 w-4" />
                  Email Me
                </a>
                {socialLinks.length > 0 ? (
                  <a
                    href={socialLinks[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30"
                  >
                    <Code2 className="h-4 w-4" />
                    Follow
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} {activeProfile.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialLinks.slice(0, 4).map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
