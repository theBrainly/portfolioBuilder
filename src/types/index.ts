import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import type {
  DesignPreset,
  HomeSectionId,
  ThemePalette,
  NavigableSectionId,
} from "@/constants/siteCustomization";

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      portfolioSlug: string;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role: string;
    portfolioSlug: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    portfolioSlug: string;
  }
}

// Data types
export interface IProject {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  thumbnail: string;
  images: string[];
  techStack: string[];
  category: "Full Stack" | "Frontend" | "Backend" | "Mobile" | "Other";
  liveUrl?: string;
  githubUrl?: string;
  clientName?: string;
  completionDate?: string;
  isFeatured: boolean;
  isVisible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface IExperience {
  _id: string;
  company: string;
  position: string;
  type: "Full Time" | "Freelance" | "Contract" | "Internship";
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  techUsed: string[];
  companyLogo?: string;
  companyUrl?: string;
  order: number;
  isVisible: boolean;
  createdAt: string;
}

export interface ISkill {
  _id: string;
  name: string;
  icon: string;
  category: "Frontend" | "Backend" | "Database" | "DevOps" | "Tools" | "Other";
  proficiency: number;
  order: number;
  isVisible: boolean;
}

export interface ITestimonial {
  _id: string;
  clientName: string;
  clientPosition: string;
  clientImage?: string;
  content: string;
  rating: number;
  projectId?: string;
  isVisible: boolean;
  order: number;
  createdAt: string;
}

export interface IMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  repliedAt?: string;
  createdAt: string;
}

export interface ISiteSettings {
  _id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCTA: string;
  heroImage?: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage?: string;
  yearsOfExperience: number;
  totalProjects: number;
  totalClients: number;
  email: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  resumeUrl?: string;
  siteTitle: string;
  siteDescription: string;
  ogImage?: string;
  customDomain?: string;
  portfolioSlug?: string;
  brandName: string;
  brandMark: string;
  navbarCTA: string;
  footerDescription: string;
  footerCopyright: string;
  themePalette: ThemePalette;
  designPreset: DesignPreset;
  homeSectionOrder: HomeSectionId[];
  sectionLabels: Record<NavigableSectionId, string>;
}

export interface DashboardStats {
  totalProjects: number;
  totalExperience: number;
  totalSkills: number;
  totalTestimonials: number;
  totalMessages: number;
  unreadMessages: number;
  recentMessages: IMessage[];
  recentProjects: IProject[];
}
