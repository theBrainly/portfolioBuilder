import { z } from "zod";
import {
  DESIGN_PRESET_IDS,
  HOME_SECTION_IDS,
  THEME_PALETTE_IDS,
} from "@/constants/siteCustomization";
import {
  isReservedPortfolioSlug,
  isValidCustomDomain,
  normalizeCustomDomain,
  normalizePortfolioSlug,
} from "@/lib/portfolioUrl";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  shortDescription: z.string().min(1, "Short description is required").max(300),
  longDescription: z.string().optional().default(""),
  thumbnail: z.string().optional().default(""),
  images: z.array(z.string()).optional().default([]),
  techStack: z.array(z.string()).min(1, "At least one tech is required"),
  category: z.enum(["Full Stack", "Frontend", "Backend", "Mobile", "Other"]),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  clientName: z.string().optional().default(""),
  completionDate: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  isVisible: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  type: z.enum(["Full Time", "Freelance", "Contract", "Internship"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional().default(false),
  description: z.string().min(1, "Description is required"),
  responsibilities: z.array(z.string()).optional().default([]),
  techUsed: z.array(z.string()).optional().default([]),
  companyLogo: z.string().optional().default(""),
  companyUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional().default(""),
  category: z.enum(["Frontend", "Backend", "Database", "DevOps", "Tools", "Other"]),
  proficiency: z.number().min(0).max(100).optional().default(80),
  order: z.number().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientPosition: z.string().min(1, "Position is required"),
  clientImage: z.string().optional().default(""),
  content: z.string().min(10, "Content must be 10+ characters"),
  rating: z.number().min(1).max(5).optional().default(5),
  projectId: z.string().optional(),
  isVisible: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be 2+ characters"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(3, "Subject must be 3+ characters"),
  message: z.string().min(10, "Message must be 10+ characters"),
  portfolioSlug: z.string().optional().default(""),
});

export const settingsSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroDescription: z.string().min(1),
  heroCTA: z.string().optional().default("View My Work"),
  heroImage: z.string().optional().default(""),
  aboutTitle: z.string().optional().default("About Me"),
  aboutDescription: z.string().min(1),
  aboutImage: z.string().optional().default(""),
  yearsOfExperience: z.number().min(0),
  totalProjects: z.number().min(0),
  totalClients: z.number().min(0),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  location: z.string().optional().default(""),
  github: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  resumeUrl: z.string().optional().default(""),
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
  ogImage: z.string().optional().default(""),
  customDomain: z
    .string()
    .optional()
    .default("")
    .transform((value) => normalizeCustomDomain(value))
    .refine((value) => isValidCustomDomain(value), {
      message: "Enter a valid custom domain such as yourname.com",
    }),
  portfolioSlug: z
    .string()
    .optional()
    .default("")
    .transform((value) => normalizePortfolioSlug(value))
    .refine((value) => !value || !isReservedPortfolioSlug(value), {
      message: "Choose a different slug because this path is reserved",
    }),
  brandName: z.string().min(1, "Brand name is required"),
  brandMark: z.string().min(1, "Logo mark is required").max(3, "Use up to 3 characters"),
  navbarCTA: z.string().min(1, "Navbar CTA is required"),
  footerDescription: z.string().min(1, "Footer description is required"),
  footerCopyright: z.string().min(1, "Footer copyright is required"),
  themePalette: z.enum(THEME_PALETTE_IDS),
  designPreset: z.enum(DESIGN_PRESET_IDS),
  homeSectionOrder: z
    .array(z.enum(HOME_SECTION_IDS))
    .length(HOME_SECTION_IDS.length, "Every homepage section must be ordered exactly once")
    .refine((value) => new Set(value).size === HOME_SECTION_IDS.length, {
      message: "Homepage sequence cannot contain duplicates",
    }),
  sectionLabels: z.object({
    about: z.string().min(1),
    skills: z.string().min(1),
    experience: z.string().min(1),
    projects: z.string().min(1),
    testimonials: z.string().min(1),
    contact: z.string().min(1),
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be 2+ characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ characters"),
  portfolioSlug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .transform((value) => normalizePortfolioSlug(value))
    .refine((value) => !!value && !isReservedPortfolioSlug(value), {
      message: "Choose a different slug because this path is reserved",
    }),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
