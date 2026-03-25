import mongoose, { Schema, Document } from "mongoose";
import {
  DEFAULT_HOME_SECTION_ORDER,
  DEFAULT_SECTION_LABELS,
  DESIGN_PRESET_IDS,
  HOME_SECTION_IDS,
  THEME_PALETTE_IDS,
  type DesignPreset,
  type HomeSectionId,
  type ThemePalette,
} from "@/constants/siteCustomization";

export interface ISettingsDocument extends Document {
  userId: mongoose.Types.ObjectId;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroCTA: string;
  heroImage: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  yearsOfExperience: number;
  totalProjects: number;
  totalClients: number;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  resumeUrl: string;
  siteTitle: string;
  siteDescription: string;
  ogImage: string;
  customDomain: string;
  portfolioSlug: string;
  brandName: string;
  brandMark: string;
  navbarCTA: string;
  footerDescription: string;
  footerCopyright: string;
  themePalette: ThemePalette;
  designPreset: DesignPreset;
  homeSectionOrder: HomeSectionId[];
  sectionLabels: typeof DEFAULT_SECTION_LABELS;
}

const SectionLabelsSchema = new Schema(
  {
    about: { type: String, default: DEFAULT_SECTION_LABELS.about },
    skills: { type: String, default: DEFAULT_SECTION_LABELS.skills },
    experience: { type: String, default: DEFAULT_SECTION_LABELS.experience },
    projects: { type: String, default: DEFAULT_SECTION_LABELS.projects },
    testimonials: { type: String, default: DEFAULT_SECTION_LABELS.testimonials },
    contact: { type: String, default: DEFAULT_SECTION_LABELS.contact },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    heroTitle: { type: String, default: "Hi, I'm Developer" },
    heroSubtitle: { type: String, default: "Full Stack Developer" },
    heroDescription: { type: String, default: "I build exceptional digital experiences." },
    heroCTA: { type: String, default: "View My Work" },
    heroImage: { type: String, default: "" },
    aboutTitle: { type: String, default: "About Me" },
    aboutDescription: { type: String, default: "" },
    aboutImage: { type: String, default: "" },
    yearsOfExperience: { type: Number, default: 0 },
    totalProjects: { type: Number, default: 0 },
    totalClients: { type: Number, default: 0 },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    instagram: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    siteTitle: { type: String, default: "Portfolio" },
    siteDescription: { type: String, default: "Full Stack Developer Portfolio" },
    ogImage: { type: String, default: "" },
    customDomain: { type: String, default: "" },
    portfolioSlug: { type: String, default: "" },
    brandName: { type: String, default: "Portfolio" },
    brandMark: { type: String, default: "P" },
    navbarCTA: { type: String, default: "Hire Me" },
    footerDescription: {
      type: String,
      default: "Designing and building thoughtful digital experiences that feel polished and perform well.",
    },
    footerCopyright: { type: String, default: "All rights reserved." },
    themePalette: { type: String, enum: THEME_PALETTE_IDS, default: "graphite" },
    designPreset: { type: String, enum: DESIGN_PRESET_IDS, default: "classic" },
    homeSectionOrder: {
      type: [{ type: String, enum: HOME_SECTION_IDS }],
      default: DEFAULT_HOME_SECTION_ORDER,
    },
    sectionLabels: {
      type: SectionLabelsSchema,
      default: () => ({ ...DEFAULT_SECTION_LABELS }),
    },
  },
  { timestamps: true }
);

SettingsSchema.index(
  { portfolioSlug: 1 },
  {
    unique: true,
    partialFilterExpression: { portfolioSlug: { $exists: true, $ne: "" } },
  }
);

SettingsSchema.index(
  { customDomain: 1 },
  {
    unique: true,
    partialFilterExpression: { customDomain: { $exists: true, $ne: "" } },
  }
);

export default mongoose.models.Settings ||
  mongoose.model<ISettingsDocument>("Settings", SettingsSchema);
