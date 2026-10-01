import "dotenv/config";
import { PrismaClient, CareerType, ProjectStatus, SettingType } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { createPool } from "mariadb";
import bcrypt from "bcryptjs";

function parseDatabaseUrl(url: string) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname || "localhost",
    port: parseInt(parsed.port || "3306", 10),
    user: parsed.username || "root",
    password: parsed.password || "",
    database: parsed.pathname.slice(1),
    bigNumberStrings: true,
    connectionLimit: 10,
  };
}

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set in .env");

// PrismaMariaDb requires a Pool, not a single Connection
const pool = createPool(parseDatabaseUrl(url));
const adapter = new PrismaMariaDb(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...\n");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@portfolio.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456";

  if (!process.env.ADMIN_PASSWORD) {
    console.warn("⚠️  ADMIN_PASSWORD is not set. Using the default demo password.");
  }

  // 1. USER
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: "Administrator", email: adminEmail, password: hashedPassword },
  });
  console.log(`✅ User: ${admin.email}`);

  // 2. PROFILE
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Your Name",
      headline: "Full Stack Developer | Building Modern Web Applications",
      bio: "A passionate full stack developer with experience in building scalable web applications.",
      location: "Jakarta, Indonesia",
      email: "hello@yourname.com",
      phone: "+62 812 3456 7890",
    },
  });
  console.log("✅ Profile: Your Name");

  // 3. EDUCATION
  await prisma.education.upsert({
    where: { id: 1 },
    update: {},
    create: {
      institution: "Universitas Indonesia",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: new Date("2020-08-01"),
      endDate: new Date("2024-07-31"),
      isCurrent: false,
      gpa: 3.75,
      description: "Focused on software engineering, algorithms, and web development.",
      order: 1,
    },
  });
  console.log("✅ Education: Universitas Indonesia");

  // 4. CAREER
  await prisma.career.upsert({
    where: { id: 1 },
    update: {},
    create: {
      company: "Tech Startup Indonesia",
      position: "Full Stack Developer Intern",
      type: CareerType.INTERNSHIP,
      startDate: new Date("2023-07-01"),
      endDate: new Date("2023-12-31"),
      isCurrent: false,
      location: "Jakarta, Indonesia",
      description: "Built and maintained web applications using Next.js and Node.js.",
      order: 1,
    },
  });
  console.log("✅ Career: Tech Startup Indonesia");

  // 5. SKILL CATEGORIES + SKILLS
  const categoryDefinitions = [
    { name: "Programming Language", icon: "code", order: 1, skills: [
      { name: "TypeScript", proficiency: 85, icon: "typescript", order: 1 },
      { name: "JavaScript", proficiency: 90, icon: "javascript", order: 2 },
      { name: "PHP", proficiency: 75, icon: "php", order: 3 },
      { name: "Python", proficiency: 70, icon: "python", order: 4 },
    ]},
    { name: "Framework & Library", icon: "layers", order: 2, skills: [
      { name: "Next.js", proficiency: 85, icon: "nextjs", order: 1 },
      { name: "React", proficiency: 85, icon: "react", order: 2 },
      { name: "Laravel", proficiency: 80, icon: "laravel", order: 3 },
      { name: "Node.js", proficiency: 78, icon: "nodejs", order: 4 },
    ]},
    { name: "Database", icon: "database", order: 3, skills: [
      { name: "MySQL", proficiency: 80, icon: "mysql", order: 1 },
      { name: "PostgreSQL", proficiency: 70, icon: "postgresql", order: 2 },
      { name: "MongoDB", proficiency: 65, icon: "mongodb", order: 3 },
      { name: "Redis", proficiency: 60, icon: "redis", order: 4 },
    ]},
    { name: "Tools & DevOps", icon: "tool", order: 4, skills: [
      { name: "Git", proficiency: 85, icon: "git", order: 1 },
      { name: "Docker", proficiency: 65, icon: "docker", order: 2 },
      { name: "Prisma", proficiency: 80, icon: "prisma", order: 3 },
      { name: "Figma", proficiency: 70, icon: "figma", order: 4 },
    ]},
  ];

  for (let i = 0; i < categoryDefinitions.length; i++) {
    const { skills: skillsData, ...catData } = categoryDefinitions[i];
    const category = await prisma.skillCategory.upsert({ where: { id: i + 1 }, update: {}, create: catData });
    for (let j = 0; j < skillsData.length; j++) {
      await prisma.skill.upsert({
        where: { id: i * 4 + j + 1 },
        update: {},
        create: { ...skillsData[j], skillCategoryId: category.id },
      });
    }
    console.log(`✅ Skills: ${category.name} (${skillsData.length})`);
  }

  // 6. PROJECT
  await prisma.project.upsert({
    where: { slug: "personal-portfolio-cms" },
    update: {},
    create: {
      title: "Personal Portfolio CMS",
      slug: "personal-portfolio-cms",
      description: "A full-featured portfolio CMS built with Next.js, TypeScript, Prisma ORM, and MySQL.",
      content: "## About\n\nBuilt to manage all portfolio content through a clean admin interface.",
      techStack: JSON.stringify(["Next.js", "TypeScript", "Prisma", "MySQL", "TailwindCSS"]),
      liveUrl: "https://yourname.com",
      githubUrl: "https://github.com/yourname/portfolio",
      status: ProjectStatus.PUBLISHED,
      featured: true,
      order: 1,
      startDate: new Date("2024-01-01"),
    },
  });
  console.log("✅ Project: Personal Portfolio CMS");

  // 7. SOCIAL LINKS
  const links = [
    { platform: "github", label: "GitHub", url: "https://github.com/yourname", icon: "github", order: 1 },
    { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/yourname", icon: "linkedin", order: 2 },
    { platform: "instagram", label: "Instagram", url: "https://instagram.com/yourname", icon: "instagram", order: 3 },
    { platform: "twitter", label: "Twitter / X", url: "https://twitter.com/yourname", icon: "twitter", order: 4 },
    { platform: "email", label: "Email", url: "mailto:hello@yourname.com", icon: "mail", order: 5 },
  ];
  for (let i = 0; i < links.length; i++) {
    await prisma.socialLink.upsert({ where: { id: i + 1 }, update: {}, create: links[i] });
  }
  console.log(`✅ Social links: ${links.length}`);

  // 8. SITE SETTINGS
  const settings = [
    { key: "site_title", value: "My Portfolio", type: SettingType.STRING, label: "Site Title", description: "Main website title", group: "general" },
    { key: "site_description", value: "Full Stack Developer Portfolio", type: SettingType.STRING, label: "Site Description", description: "Meta description", group: "general" },
    { key: "site_keywords", value: "portfolio, developer, full stack, next.js", type: SettingType.STRING, label: "Keywords", description: "Meta keywords", group: "general" },
    { key: "favicon", value: "/favicon.ico", type: SettingType.IMAGE, label: "Favicon", description: "Website favicon", group: "general" },
    { key: "theme", value: "dark", type: SettingType.STRING, label: "Default Theme", description: "dark or light", group: "theme" },
    { key: "primary_color", value: "#6366f1", type: SettingType.STRING, label: "Primary Color", description: "Brand color (hex)", group: "theme" },
    { key: "contact_email", value: "hello@yourname.com", type: SettingType.STRING, label: "Contact Email", description: "Contact form email", group: "contact" },
    { key: "contact_form_enabled", value: "true", type: SettingType.BOOLEAN, label: "Contact Form Enabled", description: "Toggle contact form", group: "contact" },
    { key: "maintenance_mode", value: "false", type: SettingType.BOOLEAN, label: "Maintenance Mode", description: "Toggle maintenance mode", group: "maintenance" },
    { key: "maintenance_message", value: "We are currently under maintenance. Please check back soon.", type: SettingType.TEXT, label: "Maintenance Message", description: "Maintenance message", group: "maintenance" },
  ];
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log(`✅ Site settings: ${settings.length}`);

  console.log("\n✨ Seeding completed!");
  console.log("\n📋 Admin Credentials:");
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log("   ⚠️  Change these after first login!\n");
}

main()
  .catch((e) => { console.error("❌ Seeding failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });