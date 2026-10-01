// ============================================================
// Domain model types (mirror Prisma models, decoupled from ORM)
// ============================================================

export type CareerType =
  | "FULLTIME"
  | "PARTTIME"
  | "INTERNSHIP"
  | "FREELANCE"
  | "CONTRACT"
  | "VOLUNTEER";

export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ContactMessageStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

export type SettingType =
  | "STRING"
  | "NUMBER"
  | "BOOLEAN"
  | "JSON"
  | "TEXT"
  | "IMAGE";

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: number;
  name: string;
  headline: string;
  bio: string;
  profileImage: string | null;
  location: string | null;
  email: string;
  phone: string | null;
  resumeUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  gpa: number | null;
  description: string | null;
  logoUrl: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Career {
  id: number;
  company: string;
  position: string;
  type: CareerType;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  location: string | null;
  description: string | null;
  logoUrl: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkillCategory {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
  skills?: Skill[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: number;
  name: string;
  proficiency: number;
  icon: string | null;
  order: number;
  skillCategoryId: number;
  skillCategory?: SkillCategory;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  coverImage: string | null;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  status: ProjectStatus;
  featured: boolean;
  order: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLink {
  id: number;
  platform: string;
  label: string;
  url: string;
  icon: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactMessageStatus;
  ipAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string | null;
  type: SettingType;
  label: string;
  description: string | null;
  group: string;
  createdAt: Date;
  updatedAt: Date;
}