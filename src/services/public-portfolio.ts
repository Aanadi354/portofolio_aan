import { prisma } from "@/lib/prisma";

export type PublicPortfolioData = {
  profile: {
    name: string;
    headline: string;
    bio: string;
    location: string | null;
    email: string;
    phone: string | null;
    profileImage: string | null;
    resumeUrl: string | null;
  } | null;
  projects: Array<{
    id: number;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    techStack: string[];
    liveUrl: string | null;
    githubUrl: string | null;
    featured: boolean;
    status: string;
  }>;
  skillCategories: Array<{
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    skills: Array<{
      id: number;
      name: string;
      proficiency: number;
      icon: string | null;
    }>;
  }>;
  socialLinks: Array<{
    id: number;
    platform: string;
    label: string;
    url: string;
    icon: string | null;
  }>;
  site: Record<string, string>;
};

export async function getPublicPortfolioData(): Promise<PublicPortfolioData> {
  const [profile, projects, skillCategories, socialLinks, settings] = await Promise.all([
    prisma.profile.findFirst({
      orderBy: { id: "asc" },
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.skillCategory.findMany({
      include: {
        skills: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    }),
    prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
    prisma.siteSetting.findMany({
      orderBy: { id: "asc" },
    }),
  ]);

  const site = settings.reduce<Record<string, string>>((acc, item) => {
    acc[item.key] = item.value ?? "";
    return acc;
  }, {});

  return {
    profile: profile
      ? {
          name: profile.name,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          email: profile.email,
          phone: profile.phone,
          profileImage: profile.profileImage,
          resumeUrl: profile.resumeUrl,
        }
      : null,
    projects: projects.map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      coverImage: project.coverImage,
      techStack: (() => {
        if (!project.techStack) return [];
        try {
          const parsed = JSON.parse(project.techStack);
          return Array.isArray(parsed) ? parsed : [project.techStack];
        } catch {
          return project.techStack.split(",").map((item) => item.trim()).filter(Boolean);
        }
      })(),
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      featured: project.featured,
      status: project.status,
    })),
    skillCategories: skillCategories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      skills: category.skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        proficiency: skill.proficiency,
        icon: skill.icon,
      })),
    })),
    socialLinks: socialLinks.map((link) => ({
      id: link.id,
      platform: link.platform,
      label: link.label,
      url: link.url,
      icon: link.icon,
    })),
    site,
  };
}
